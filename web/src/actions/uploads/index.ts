import { handleApiError } from '@/utils/api-error';

export const uploadImage = async (file: File): Promise<string> => {
  const response = await fetch('/api/uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao preparar upload da imagem');
  }

  const { uploadUrl, publicUrl } = await response.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('Erro ao enviar imagem');
  }

  return publicUrl;
};
