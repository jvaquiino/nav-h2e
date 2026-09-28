import prisma from "@/backend/services/db";
import { patchSchema } from "../../schemas";
import { z } from "zod";
import type { Role } from "@/generated/prisma";

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getAdmins() {
  return await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    orderBy: { createdAt: "asc" },
  });
}

export async function countSuperAdmins() {
  return await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
}

export async function updateUserRole(id: string, role: Role) {
  return await prisma.user.update({
    where: { id },
    data: { role },
  });
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function updateUser(id: string, data: z.infer<typeof patchSchema>) {
  return await prisma.user.update({
    where: { id },
    data
  })
}

export async function deleteUser(id: string) {
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.account.deleteMany({ where: { userId: id } });
  return await prisma.user.delete({
    where: { id }
  })
}