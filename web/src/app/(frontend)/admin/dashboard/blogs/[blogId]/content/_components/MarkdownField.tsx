'use client';

import MDEditor from '@uiw/react-md-editor';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown-preview.css';
import 'katex/dist/katex.min.css';

interface MarkdownFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownField({ value, onChange }: MarkdownFieldProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? '')}
        height={280}
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [[rehypeKatex]],
        }}
      />
    </div>
  );
}
