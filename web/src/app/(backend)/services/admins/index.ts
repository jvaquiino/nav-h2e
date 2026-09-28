import { auth } from "@/auth";
import { randomBytes } from "crypto";
import type { InviteAdminInput } from "@/backend/schemas";
import { findUserByEmail, updateUserRole } from "@/backend/services/users";

export async function inviteAdmin(data: InviteAdminInput) {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("Já existe um usuário com esse email");
  }

  const tempPassword = randomBytes(32).toString("hex");

  const created = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: tempPassword,
      callbackURL: "/admin/dashboard",
    },
  });

  const user = await updateUserRole(created.user.id, data.role);

  const redirectTo = `${process.env.BETTER_AUTH_URL}/api/password/reset`;

  await auth.api.requestPasswordReset({
    body: { email: data.email, redirectTo },
  });

  return user;
}
