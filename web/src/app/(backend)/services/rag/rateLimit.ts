import { createHash } from "crypto";
import prisma from "../db";

const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_REQUESTS = 20;

export function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function checkRateLimit(rawKey: string): Promise<boolean> {
  const key = hashKey(rawKey);
  const now = new Date();

  const existing = await prisma.chatRateLimit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > WINDOW_MS) {
    await prisma.chatRateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return true;
  }

  if (existing.count >= MAX_REQUESTS) {
    return false;
  }

  await prisma.chatRateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return true;
}
