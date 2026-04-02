import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

declare global {
  var prisma: PrismaClient | undefined;
}

let lastQuery: string | null = null;

const prisma =
  global.prisma ||
  new PrismaClient({ adapter, log: [{ emit: "event", level: "query" }] });

if (prisma && typeof (prisma as any).$on === "function") {
  (prisma as any).$on("query", (event: any) => {
    lastQuery = event.query;
  });
}

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };

export function getLastQuery(): string | null {
  return lastQuery;
}
