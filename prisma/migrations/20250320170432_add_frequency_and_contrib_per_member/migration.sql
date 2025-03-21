/*
  Warnings:

  - You are about to drop the column `contribution` on the `tontine` table. All the data in the column will be lost.
  - The `frequency` column on the `tontine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `contributionPerMember` to the `tontine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TontineFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'TRIMESTRIAL', 'YEARLY');

-- AlterTable
ALTER TABLE "tontine" DROP COLUMN "contribution",
ADD COLUMN     "contributionPerMember" DECIMAL(65,30) NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "TontineFrequency" NOT NULL DEFAULT 'MONTHLY';
