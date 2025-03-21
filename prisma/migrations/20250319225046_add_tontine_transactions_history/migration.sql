-- CreateEnum
CREATE TYPE "TontineType" AS ENUM ('ROTATIF', 'INVESTISSEMENT', 'PROJET');

-- CreateEnum
CREATE TYPE "TontineRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "TontineStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AllocationMethod" AS ENUM ('FIXED', 'VOTE', 'RANDOM', 'ENCHERE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('COTISATION', 'REDISTRIBUTION');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "HistoryAction" AS ENUM ('CREATION', 'JOIN', 'EXCLUSION', 'PAYMENT', 'RULES_UPDATED', 'REDISTRIBUTION');

-- CreateTable
CREATE TABLE "tontine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TontineType" NOT NULL,
    "frequency" TEXT NOT NULL,
    "contribution" DECIMAL(65,30) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "maxMembers" INTEGER NOT NULL,
    "status" "TontineStatus" NOT NULL DEFAULT 'ACTIVE',
    "penaltyFee" DECIMAL(65,30) NOT NULL DEFAULT 5.0,
    "allocationMethod" "AllocationMethod" NOT NULL DEFAULT 'FIXED',
    "rules" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tontine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tontine" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tontineId" TEXT NOT NULL,
    "role" "TontineRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tontine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tontineId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tontine_history" (
    "id" TEXT NOT NULL,
    "tontineId" TEXT NOT NULL,
    "userId" TEXT,
    "action" "HistoryAction" NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tontine_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_tontine_userId_tontineId_key" ON "user_tontine"("userId", "tontineId");

-- AddForeignKey
ALTER TABLE "user_tontine" ADD CONSTRAINT "user_tontine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tontine" ADD CONSTRAINT "user_tontine_tontineId_fkey" FOREIGN KEY ("tontineId") REFERENCES "tontine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_tontineId_fkey" FOREIGN KEY ("tontineId") REFERENCES "tontine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_history" ADD CONSTRAINT "tontine_history_tontineId_fkey" FOREIGN KEY ("tontineId") REFERENCES "tontine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tontine_history" ADD CONSTRAINT "tontine_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
