import type { Role, User } from '@/generated/prisma';
import { handleApiError } from '@/utils/api-error';

export type InviteAdminData = {
  name: string;
  email: string;
  role: Extract<Role, 'ADMIN' | 'SUPER_ADMIN'>;
};

export const getAdmins = async (): Promise<User[]> => {
  const response = await fetch('/api/admins');
  if (!response.ok) {
    await handleApiError(response, 'Erro ao buscar admins');
  }
  return await response.json();
};

export const inviteAdmin = async (data: InviteAdminData) => {
  const response = await fetch('/api/admins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao convidar admin');
  }

  return await response.json();
};

export const updateAdminRole = async (id: string, role: Role) => {
  const response = await fetch(`/api/admins/${id}/role`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao alterar role');
  }

  return await response.json();
};

export const revokeAdmin = async (id: string) => {
  const response = await fetch(`/api/admins/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    await handleApiError(response, 'Erro ao revogar acesso');
  }

  return true;
};
