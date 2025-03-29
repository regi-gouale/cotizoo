import { PrismaClient } from "@prisma/client";

// Création de l'instance Prisma avec logging en mode développement
const prismaClientSingleton = () => {
  return new PrismaClient();
  // {
  //   log:
  //     process.env.NODE_ENV === "development"
  //       ? ["query", "error", "warn"]
  //       : ["error"],
  // }
};

// Type de l'instance Prisma
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Support pour le rechargement à chaud en mode développement
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Utilisation d'une instance singleton de Prisma
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
