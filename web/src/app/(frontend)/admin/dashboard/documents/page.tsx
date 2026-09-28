'use client';

import useSWR from 'swr';
import toast from 'react-hot-toast';
import { FileText, RefreshCw, Trash2 } from 'lucide-react';
import AdminHeader from '@/components/base/header/AdminHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { getDocuments, deleteDocument, reprocessDocument } from '@/actions/documents';
import { getErrorMessage } from '@/utils/api-error';
import { UploadDocumentDialog } from './_components/UploadDocumentDialog';
import type { Document, DocumentStatus } from '@/generated/prisma';

const STATUS_LABEL: Record<DocumentStatus, string> = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  READY: 'Pronto',
  FAILED: 'Falhou',
};

const STATUS_VARIANT: Record<DocumentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  PROCESSING: 'secondary',
  READY: 'default',
  FAILED: 'destructive',
};

export default function DocumentsPage() {
  const { data: documents, isLoading, mutate } = useSWR<Document[]>('/api/documents', getDocuments);

  const Paragraph = () => (
    <>
      Documentos usados como base de conhecimento do chatbot de hidrogênio e engenharia
      naval. Cada arquivo é dividido em blocos e transformado em embeddings automaticamente.
    </>
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      await mutate();
      toast.success('Documento removido');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao remover documento'));
    }
  };

  const handleReprocess = async (id: string) => {
    try {
      await reprocessDocument(id);
      await mutate();
      toast.success('Documento reprocessado');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao reprocessar documento'));
    }
  };

  return (
    <>
      <AdminHeader Icon={FileText} Paragraph={Paragraph} title="Documentos">
        <UploadDocumentDialog onUploaded={() => mutate()} />
      </AdminHeader>

      <div className="w-full mx-2 mt-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading-spin"></div>
            <p className="mt-2 text-gray-600">Carregando documentos...</p>
          </div>
        ) : !documents || documents.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Nenhum documento cadastrado ainda.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="font-medium">{doc.title}</div>
                    {doc.description && (
                      <div className="text-xs text-muted-foreground">{doc.description}</div>
                    )}
                    {doc.status === 'FAILED' && doc.error && (
                      <div className="text-xs text-destructive mt-1">{doc.error}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[doc.status]}>{STATUS_LABEL[doc.status]}</Badge>
                  </TableCell>
                  <TableCell>{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {doc.status === 'FAILED' && (
                      <Button variant="outline" size="sm" onClick={() => handleReprocess(doc.id)}>
                        <RefreshCw className="w-4 h-4" /> Reprocessar
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" /> Remover
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover documento?</AlertDialogTitle>
                          <AlertDialogDescription>
                            &quot;{doc.title}&quot; e todos os seus blocos/embeddings serão
                            removidos permanentemente. O chatbot deixará de usar esse conteúdo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(doc.id)}>
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
