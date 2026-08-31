'use client';

import { use } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText } from 'lucide-react';
import AdminHeader from '@/components/base/header/AdminHeader';
import {
  getBlog,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
} from '@/actions/blogs';
import { getErrorMessage } from '@/utils/api-error';
import { BlockEditor, type BlockDraft } from './_components/BlockEditor';
import { AddBlockForm } from './_components/AddBlockForm';
import type { Blog, BlogContentBlock } from '@/generated/prisma';

type BlogWithBlocks = Blog & { contentBlocks: BlogContentBlock[] };

export default function BlogContentPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = use(params);
  const { data: blog, isLoading, mutate } = useSWR<BlogWithBlocks>(
    `/api/blogs/${blogId}`,
    () => getBlog(blogId)
  );

  const Paragraph = () => <>Adicione, edite e reordene o conteúdo do blog.</>;

  const blocks = (blog?.contentBlocks ?? []).slice().sort((a, b) => a.order - b.order);

  const handleAdd = async (data: BlockDraft) => {
    try {
      await createBlock(blogId, {
        type: data.type,
        markdown: data.type === 'MARKDOWN' ? data.markdown : undefined,
        videoUrl: data.type === 'VIDEO' ? data.videoUrl : undefined,
      });
      await mutate();
      toast.success('Bloco adicionado');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao adicionar bloco'));
    }
  };

  const handleSave = async (blockId: string, data: BlockDraft) => {
    try {
      await updateBlock(blogId, blockId, {
        type: data.type,
        markdown: data.type === 'MARKDOWN' ? data.markdown : undefined,
        videoUrl: data.type === 'VIDEO' ? data.videoUrl : undefined,
      });
      await mutate();
      toast.success('Bloco salvo');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar bloco'));
    }
  };

  const handleDelete = async (blockId: string) => {
    try {
      await deleteBlock(blogId, blockId);
      await mutate();
      toast.success('Bloco excluído');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir bloco'));
    }
  };

  const handleMove = async (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === blockId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (index === -1 || targetIndex < 0 || targetIndex >= blocks.length) {
      return;
    }

    const reordered = blocks.slice();
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    try {
      await reorderBlocks(
        blogId,
        reordered.map((block, i) => ({ id: block.id, order: i }))
      );
      await mutate();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao reordenar blocos'));
    }
  };

  return (
    <>
      <AdminHeader Icon={FileText} Paragraph={Paragraph} title={blog ? `Conteúdo: ${blog.name}` : 'Conteúdo'}>
        <Link href="/admin/dashboard/blogs" className="admin-header-button colorTransition">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </AdminHeader>

      <div className="w-full mx-2 mt-8 max-w-3xl space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading-spin"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        ) : (
          <>
            {blocks.map((block, index) => (
              <BlockEditor
                key={block.id}
                block={block}
                index={index}
                total={blocks.length}
                onSave={handleSave}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            ))}

            <AddBlockForm onAdd={handleAdd} />
          </>
        )}
      </div>
    </>
  );
}
