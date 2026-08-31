import type { Document } from '@/generated/prisma';
import { handleApiError } from '@/utils/api-error';

type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
  fileKey: string;
};

export const getDocuments = async (): Promise<Document[]> => {
  const response = await fetch('/api/documents');
  if (!response.ok) {
    await handleApiError(response, 'Erro ao buscar documentos');
  }
  return await response.json();
};

const getUploadUrl = async (filename: string, contentType: string): Promise<UploadUrlResponse> => {
  const response = await fetch('/api/documents/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, contentType }),
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao gerar URL de upload');
  }

  return await response.json();
};

const uploadFileToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar o arquivo');
  }
};

export type CreateDocumentData = {
  title: string;
  description?: string;
  file: File;
};

export const uploadDocument = async ({ title, description, file }: CreateDocumentData): Promise<Document> => {
  const { uploadUrl, fileUrl, fileKey } = await getUploadUrl(file.name, file.type);

  await uploadFileToS3(uploadUrl, file);

  const response = await fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, fileUrl, fileKey, mimeType: file.type }),
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao criar documento');
  }

  return await response.json();
};

export const reprocessDocument = async (id: string): Promise<Document> => {
  const response = await fetch(`/api/documents/${id}/process`, { method: 'POST' });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao reprocessar documento');
  }

  return await response.json();
};

export const deleteDocument = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao deletar documento');
  }

  return true;
};
