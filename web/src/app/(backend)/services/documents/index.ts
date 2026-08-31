import prisma from "../db";
import { s3, S3_BUCKET } from "@/lib/s3";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { embedDocuments } from "@/lib/voyage";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { splitIntoChunks } from "../rag/chunk";
import type { CreateDocumentInput } from "@/backend/schemas";

// heurística: se o texto extraído pela camada de texto do PDF for curto demais
// em relação ao número de páginas, o PDF provavelmente é escaneado/baseado em imagem
const MIN_CHARS_PER_PAGE = 20;
// limite de tamanho do PDF para o fallback de OCR via Claude (base64 precisa caber
// na requisição de ~32MB da Messages API - mantemos margem de segurança)
const MAX_VISION_FALLBACK_BYTES = 24 * 1024 * 1024;

const OCR_PROMPT =
  "Transcreva integralmente todo o texto legível deste documento PDF, incluindo texto " +
  "dentro de imagens, gráficos, tabelas e páginas escaneadas. Preserve a ordem do " +
  "conteúdo e a estrutura de parágrafos/seções o máximo possível. Não resuma, não " +
  "comente e não adicione texto que não esteja no documento. Se uma página não tiver " +
  "texto legível, apenas pule para a próxima.";

export async function getAllDocuments() {
  return prisma.document.findMany({
    orderBy: { uploadedAt: "desc" },
  });
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id } });
}

export async function createDocument(data: CreateDocumentInput) {
  return prisma.document.create({
    data: {
      title: data.title,
      description: data.description,
      fileUrl: data.fileUrl,
      fileKey: data.fileKey,
      mimeType: data.mimeType,
      status: "PENDING",
    },
  });
}

export async function deleteDocument(id: string) {
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document) {
    throw new Error("Documento não encontrado");
  }

  await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: document.fileKey }));

  return prisma.document.delete({ where: { id } });
}

async function extractTextViaClaudeVision(bytes: Uint8Array): Promise<string> {
  const base64 = Buffer.from(bytes).toString("base64");

  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 16000,
    thinking: { type: "disabled" },
    output_config: { effort: "medium" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64 },
          },
          { type: "text", text: OCR_PROMPT },
        ],
      },
    ],
  });

  return response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n\n")
    .trim();
}

async function extractDocumentText(fileKey: string, mimeType: string): Promise<string> {
  const object = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: fileKey }));
  const bytes = await object.Body!.transformToByteArray();

  if (mimeType === "application/pdf") {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(bytes);
    const { text, totalPages } = await extractText(pdf, { mergePages: true });

    const looksScanned = text.trim().length < totalPages * MIN_CHARS_PER_PAGE;

    if (looksScanned) {
      if (bytes.byteLength > MAX_VISION_FALLBACK_BYTES) {
        throw new Error(
          "O PDF parece ser escaneado (sem texto extraível) e é grande demais para " +
            "OCR automático (limite de 24MB). Divida o arquivo em partes menores ou " +
            "use uma versão com texto selecionável."
        );
      }

      return extractTextViaClaudeVision(bytes);
    }

    return text;
  }

  return new TextDecoder("utf-8").decode(bytes);
}

export async function processDocument(id: string) {
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document) {
    throw new Error("Documento não encontrado");
  }

  await prisma.document.update({ where: { id }, data: { status: "PROCESSING", error: null } });

  try {
    const text = await extractDocumentText(document.fileKey, document.mimeType);
    const chunks = splitIntoChunks(text);

    if (chunks.length === 0) {
      throw new Error("Não foi possível extrair texto do documento");
    }

    const embeddings = await embedDocuments(chunks);

    await prisma.documentChunk.deleteMany({ where: { documentId: id } });
    await prisma.documentChunk.createMany({
      data: chunks.map((content, index) => ({
        documentId: id,
        order: index,
        content,
        embedding: embeddings[index],
      })),
    });

    return prisma.document.update({ where: { id }, data: { status: "READY" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao processar documento";
    await prisma.document.update({ where: { id }, data: { status: "FAILED", error: message } });
    throw error;
  }
}
