'use client';

import MDEditor from '@uiw/react-md-editor';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { BlogContentBlock } from '@/generated/prisma';

import '@uiw/react-markdown-preview/markdown-preview.css';
import 'katex/dist/katex.min.css';

function isYoutubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function toYoutubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function BlockRenderer({ block }: { block: BlogContentBlock }) {
  if (block.type === 'MARKDOWN' && block.markdown) {
    return (
      <div data-color-mode="light">
        <MDEditor.Markdown
          source={block.markdown}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[[rehypeKatex]]}
        />
      </div>
    );
  }

  if (block.type === 'VIDEO' && block.videoUrl) {
    return isYoutubeUrl(block.videoUrl) ? (
      <div className="aspect-video">
        <iframe
          src={toYoutubeEmbedUrl(block.videoUrl)}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      </div>
    ) : (
       
      <video src={block.videoUrl} controls className="w-full rounded-lg" />
    );
  }

  return null;
}
