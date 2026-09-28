import { z } from "zod";

export const uploadRequestSchema = z.object({
  filename: z.string().min(1, "Nome do arquivo é obrigatório").max(200),
  contentType: z
    .string()
    .regex(/^image\/(png|jpe?g|webp|gif|svg\+xml)$/, "Tipo de arquivo deve ser uma imagem"),
});

export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
