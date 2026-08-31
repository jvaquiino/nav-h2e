import { z } from "zod";

export const documentUploadRequestSchema = z.object({
  filename: z.string().min(1, "Nome do arquivo é obrigatório").max(200),
  contentType: z
    .string()
    .regex(/^(application\/pdf|text\/plain|text\/markdown)$/, "Tipo de arquivo deve ser PDF, TXT ou Markdown"),
});

export const createDocumentSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Título é obrigatório" : "Título deve ser um texto",
    })
    .min(1, "Título não pode estar vazio")
    .max(200, "Título não pode ter mais de 200 caracteres")
    .trim(),
  description: z.string().trim().optional(),
  fileUrl: z.string().url("URL do arquivo inválida"),
  fileKey: z.string().min(1, "Chave do arquivo é obrigatória"),
  mimeType: z
    .string()
    .regex(/^(application\/pdf|text\/plain|text\/markdown)$/, "Tipo de arquivo inválido"),
});

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "Pelo menos uma mensagem é obrigatória")
    .max(20, "Conversa muito longa"),
});

export type DocumentUploadRequestInput = z.infer<typeof documentUploadRequestSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
