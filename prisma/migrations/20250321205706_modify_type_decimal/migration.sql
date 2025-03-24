/*
  Warnings:

  - You are about to alter the column `penaltyFee` on the `tontine` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `contributionPerMember` on the `tontine` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "tontine" ADD COLUMN     "totalContributions" DOUBLE PRECISION DEFAULT 0.0,
ALTER COLUMN "penaltyFee" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "contributionPerMember" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
