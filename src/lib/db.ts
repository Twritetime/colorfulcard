import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient | undefined;
  var neonClient: ReturnType<typeof neon> | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// 直接使用Neon驱动的SQL客户端（在需要原始SQL时使用）
export const sql = globalThis.neonClient || neon(process.env.POSTGRES_URL_NON_POOLING!);

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
  globalThis.neonClient = sql;
} 