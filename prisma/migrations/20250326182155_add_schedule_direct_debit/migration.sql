-- AlterTable
ALTER TABLE "tontine" ALTER COLUMN "penaltyFee" SET DEFAULT 0.0,
ALTER COLUMN "contributionPerMember" DROP NOT NULL,
ALTER COLUMN "contributionPerMember" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "user_tontine" ADD COLUMN     "contribution" DOUBLE PRECISION DEFAULT 0.0;

-- CreateTable
CREATE TABLE "scheduled_direct_debit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "executionDate" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduled_direct_debit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scheduled_direct_debit" ADD CONSTRAINT "scheduled_direct_debit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_direct_debit" ADD CONSTRAINT "scheduled_direct_debit_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
