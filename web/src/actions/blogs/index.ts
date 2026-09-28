import { BlogFormData } from '@/app/(frontend)/admin/dashboard/blogs/_components/BlogForm';
import { Blog, BlogContentBlock } from '@/generated/prisma';
import { handleApiError } from '@/utils/api-error';

export const getBlogs = async () => {
  const response = await fetch('/api/blogs');
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    await handleApiError(response, 'Erro ao buscar blogs');
  }
};

export const getBlog = async (blogId: string) => {
  const response = await fetch(`/api/blogs/${blogId}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    await handleApiError(response, 'Erro ao buscar blog');
  }
};

export const createBlog = async (data: BlogFormData) => {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const created = await response.json();
    return created;
  } else {
    await handleApiError(response, 'Erro ao criar blog');
  }
};

export const updateBlog = async (blogId: string, data: Partial<Blog>) => {
  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const updated = await response.json();
    return updated;
  } else {
    await handleApiError(response, 'Erro ao atualizar blog');
  }
};

export const deleteBlog = async (blogId: string) => {
  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao deletar blog');
  }

  return true;
};

type CreateBlockData = Pick<BlogContentBlock, 'type' | 'markdown' | 'videoUrl' | 'order'>;

export const createBlock = async (blogId: string, data: Partial<CreateBlockData>) => {
  const response = await fetch(`/api/blogs/${blogId}/content-blocks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    return await response.json();
  } else {
    await handleApiError(response, 'Erro ao criar bloco de conteúdo');
  }
};

export const updateBlock = async (blogId: string, blockId: string, data: Partial<CreateBlockData>) => {
  const response = await fetch(`/api/blogs/${blogId}/content-blocks/${blockId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    return await response.json();
  } else {
    await handleApiError(response, 'Erro ao atualizar bloco de conteúdo');
  }
};

export const deleteBlock = async (blogId: string, blockId: string) => {
  const response = await fetch(`/api/blogs/${blogId}/content-blocks/${blockId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao deletar bloco de conteúdo');
  }

  return true;
};

export const reorderBlocks = async (blogId: string, blocks: { id: string; order: number }[]) => {
  const response = await fetch(`/api/blogs/${blogId}/content-blocks/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks })
  });

  if (response.ok) {
    return await response.json();
  } else {
    await handleApiError(response, 'Erro ao reordenar blocos de conteúdo');
  }
};
