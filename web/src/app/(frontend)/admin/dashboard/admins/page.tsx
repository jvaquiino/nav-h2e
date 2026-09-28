'use client';

import useSWR from 'swr';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
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
import { authClient } from '@/lib/auth-client';
import { getAdmins, updateAdminRole, revokeAdmin } from '@/actions/admins';
import { getErrorMessage } from '@/utils/api-error';
import { InviteAdminDialog } from './_components/InviteAdminDialog';
import type { Role, User } from '@/generated/prisma';

export default function AdminsPage() {
  const { data: session } = authClient.useSession();
  const isSuperAdmin = session?.role === 'SUPER_ADMIN';

  const { data: admins, isLoading, mutate } = useSWR<User[]>('/api/admins', getAdmins);

  const Paragraph = () => <>Veja e gerencie os administradores da plataforma.</>;

  const handleRoleChange = async (userId: string, role: Role) => {
    try {
      await updateAdminRole(userId, role);
      await mutate();
      toast.success('Role atualizada');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao atualizar role'));
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      await revokeAdmin(userId);
      await mutate();
      toast.success('Acesso revogado');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao revogar acesso'));
    }
  };

  return (
    <>
      <AdminHeader Icon={Lock} Paragraph={Paragraph} title="Admins">
        {isSuperAdmin && <InviteAdminDialog onInvited={() => mutate()} />}
      </AdminHeader>

      <div className="w-full mx-2 mt-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="loading-spin"></div>
            <p className="mt-2 text-gray-600">Carregando admins...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {isSuperAdmin && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(admins ?? []).map((admin) => {
                const isSelf = admin.id === session?.user?.id;

                return (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {isSuperAdmin && !isSelf ? (
                        <Select
                          value={admin.role}
                          onValueChange={(value) => handleRoleChange(admin.id, value as Role)}
                        >
                          <SelectTrigger size="sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={admin.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}>
                          {admin.role}
                        </Badge>
                      )}
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell className="text-right">
                        {!isSelf && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Revogar acesso
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revogar acesso de admin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {admin.name} deixará de ter acesso ao painel de administração.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRevoke(admin.id)}>
                                  Revogar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
