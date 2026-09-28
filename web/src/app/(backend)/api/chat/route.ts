import { NextRequest, NextResponse } from "next/server";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { retrieveRelevantChunks } from "@/backend/services/rag/retrieve";
import { checkRateLimit } from "@/backend/services/rag/rateLimit";
import { chatRequestSchema } from "@/backend/schemas";
import { returnInvalidDataErrors, validBody } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import { getUserFromRequest } from "@/utils/api/getUserFromRequest";

const SYSTEM_PROMPT = `Você é o assistente de pesquisa do projeto de Hidrogênio Naval da Escola Politécnica da USP (Poli USP), especializado em hidrogênio como combustível e em engenharia naval.

Responda às perguntas do usuário usando o CONTEXTO fornecido em cada mensagem, extraído da base de documentos de pesquisa do projeto. Regras:
- Se o contexto não cobrir a pergunta, diga isso claramente em vez de inventar informações.
- Cite os documentos de origem pelo título quando usar informação deles.
- Responda em português do Brasil, de forma clara, objetiva e tecnicamente precisa.
- Você pode usar conhecimento geral sobre hidrogênio e engenharia naval para contextualizar, mas deixe claro quando a resposta vem dos documentos e quando é conhecimento geral.
- Não inclua tags internas ou de sistema (como <thinking>) na resposta.`;

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (user instanceof NextResponse) return user;

  const allowed = await checkRateLimit(user.id);

  if (!allowed) {
    return NextResponse.json(
      toErrorMessage("Muitas mensagens em pouco tempo. Tente novamente mais tarde."),
      { status: 429 }
    );
  }

  const body = await validBody(request);
  const validationResult = chatRequestSchema.safeParse(body);

  if (!validationResult.success) {
    return returnInvalidDataErrors(validationResult.error);
  }

  const { messages } = validationResult.data;
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  if (!lastUserMessage) {
    return NextResponse.json(toErrorMessage("Nenhuma pergunta encontrada"), { status: 400 });
  }

  let context = "Nenhum documento relevante foi encontrado na base de conhecimento.";
  try {
    const chunks = await retrieveRelevantChunks(lastUserMessage.content);
    if (chunks.length > 0) {
      context = chunks
        .map((chunk, index) => `[${index + 1}] Fonte: ${chunk.documentTitle}\n${chunk.content}`)
        .join("\n\n---\n\n");
    }
  } catch (error) {
    console.error("Falha ao buscar contexto no vector search:", error);
  }

  const anthropicMessages = messages.map((message, index) => {
    const isLastUserMessage =
      message.role === "user" && index === messages.lastIndexOf(lastUserMessage);

    return {
      role: message.role,
      content: isLastUserMessage
        ? `CONTEXTO:\n${context}\n\nPERGUNTA DO USUÁRIO:\n${message.content}`
        : message.content,
    };
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          thinking: { type: "disabled" },
          output_config: { effort: "medium" },
          messages: anthropicMessages,
        });

        messageStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        await messageStream.finalMessage();
        controller.close();
      } catch (error) {
        console.error("Erro ao gerar resposta do chat:", error);
        controller.enqueue(
          encoder.encode("\n\n[Ocorreu um erro ao gerar a resposta. Tente novamente.]")
        );
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
