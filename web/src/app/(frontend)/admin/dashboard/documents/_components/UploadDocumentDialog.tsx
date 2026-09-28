'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { uploadDocument } from '@/actions/documents';
import { getErrorMessage } from '@/utils/api-error';

interface UploadDocumentDialogProps {
  onUploaded: () => void;
}

export function UploadDocumentDialog({ onUploaded }: UploadDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid = title.trim().length > 0 && file !== null;

  const reset = () => {
    setTitle('');
    setDescription('');
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !file) return;

    try {
      setLoading(true);
      await uploadDocument({ title, description: description || undefined, file });
      toast.success('Documento enviado e processado');
      reset();
      setOpen(false);
      onUploaded();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao enviar documento'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="admin-header-button colorTransition">
          <Plus /> Adicionar Documento
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Adicionar Documento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo (PDF, TXT ou Markdown)</Label>
            <Input
              id="file"
              type="file"
              accept="application/pdf,text/plain,text/markdown,.md"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
            <p className="text-xs text-muted-foreground">
              O documento é processado automaticamente após o envio (extração de texto,
              divisão em blocos e geração de embeddings) para alimentar o chatbot.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!isValid || loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Processando...' : 'Enviar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
