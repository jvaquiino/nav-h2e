'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { MarkdownField } from './MarkdownField';
import { BlockDraft } from './BlockEditor';

interface AddBlockFormProps {
  onAdd: (data: BlockDraft) => Promise<void>;
}

const EMPTY_DRAFT: BlockDraft = { type: 'MARKDOWN', markdown: '', videoUrl: '' };

export function AddBlockForm({ onAdd }: AddBlockFormProps) {
  const [draft, setDraft] = useState<BlockDraft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);

  const isValid =
    draft.type === 'MARKDOWN' ? draft.markdown.trim().length > 0 : draft.videoUrl.trim().length > 0;

  const handleAdd = async () => {
    if (!isValid) return;

    setAdding(true);
    try {
      await onAdd(draft);
      setDraft(EMPTY_DRAFT);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="border border-dashed rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Novo bloco</span>
        <Select
          value={draft.type}
          onValueChange={(value) => setDraft((prev) => ({ ...prev, type: value as BlockDraft['type'] }))}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MARKDOWN">Markdown</SelectItem>
            <SelectItem value="VIDEO">Vídeo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {draft.type === 'MARKDOWN' ? (
        <MarkdownField
          value={draft.markdown}
          onChange={(value) => setDraft((prev) => ({ ...prev, markdown: value }))}
        />
      ) : (
        <div className="space-y-1">
          <Label htmlFor="new-video-url">URL do vídeo</Label>
          <Input
            id="new-video-url"
            value={draft.videoUrl}
            onChange={(e) => setDraft((prev) => ({ ...prev, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={handleAdd} disabled={!isValid || adding}>
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Adicionar bloco
        </Button>
      </div>
    </div>
  );
}
