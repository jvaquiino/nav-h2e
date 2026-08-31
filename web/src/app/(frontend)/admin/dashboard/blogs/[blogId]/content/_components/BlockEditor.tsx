'use client';

import { useState } from 'react';
import { BlogContentBlock } from '@/generated/prisma';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowDown, ArrowUp, Loader2, Trash2 } from 'lucide-react';
import { MarkdownField } from './MarkdownField';

export type BlockDraft = {
  type: 'MARKDOWN' | 'VIDEO';
  markdown: string;
  videoUrl: string;
};

interface BlockEditorProps {
  block: BlogContentBlock;
  index: number;
  total: number;
  onSave: (blockId: string, data: BlockDraft) => Promise<void>;
  onDelete: (blockId: string) => Promise<void>;
  onMove: (blockId: string, direction: 'up' | 'down') => Promise<void>;
}

export function BlockEditor({ block, index, total, onSave, onDelete, onMove }: BlockEditorProps) {
  const [draft, setDraft] = useState<BlockDraft>({
    type: block.type,
    markdown: block.markdown ?? '',
    videoUrl: block.videoUrl ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [moving, setMoving] = useState(false);
  const dirty =
    draft.type !== block.type ||
    draft.markdown !== (block.markdown ?? '') ||
    draft.videoUrl !== (block.videoUrl ?? '');

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(block.id, draft);
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (direction: 'up' | 'down') => {
    setMoving(true);
    try {
      await onMove(block.id, direction);
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Bloco {index + 1}</span>
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

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === 0 || moving}
            onClick={() => handleMove('up')}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === total - 1 || moving}
            onClick={() => handleMove('down')}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost" size="icon">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir bloco?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(block.id)}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {draft.type === 'MARKDOWN' ? (
        <MarkdownField
          value={draft.markdown}
          onChange={(value) => setDraft((prev) => ({ ...prev, markdown: value }))}
        />
      ) : (
        <div className="space-y-1">
          <Label htmlFor={`video-${block.id}`}>URL do vídeo</Label>
          <Input
            id={`video-${block.id}`}
            value={draft.videoUrl}
            onChange={(e) => setDraft((prev) => ({ ...prev, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={handleSave} disabled={!dirty || saving}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Salvar bloco
        </Button>
      </div>
    </div>
  );
}
