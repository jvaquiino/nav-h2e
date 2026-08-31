'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { inviteAdmin, type InviteAdminData } from '@/actions/admins';
import { getErrorMessage } from '@/utils/api-error';

interface InviteAdminDialogProps {
  onInvited: () => void;
}

const EMPTY: InviteAdminData = { name: '', email: '', role: 'ADMIN' };

export function InviteAdminDialog({ onInvited }: InviteAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<InviteAdminData>(EMPTY);
  const [loading, setLoading] = useState(false);

  const isValid = data.name.trim().length > 0 && data.email.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      await inviteAdmin(data);
      toast.success('Convite enviado por email');
      setData(EMPTY);
      setOpen(false);
      onInvited();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao convidar admin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="admin-header-button colorTransition">
          <Plus /> Convidar Admin
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Convidar Admin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={data.role}
              onValueChange={(value) =>
                setData((prev) => ({ ...prev, role: value as InviteAdminData['role'] }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!isValid || loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Enviar convite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
