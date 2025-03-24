/*
  Warnings:

  - The values [TRIMESTRIAL] on the enum `TontineFrequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TontineFrequency_new" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'YEARLY');
ALTER TABLE "tontine" ALTER COLUMN "frequency" DROP DEFAULT;
ALTER TABLE "tontine" ALTER COLUMN "frequency" TYPE "TontineFrequency_new" USING ("frequency"::text::"TontineFrequency_new");
ALTER TYPE "TontineFrequency" RENAME TO "TontineFrequency_old";
ALTER TYPE "TontineFrequency_new" RENAME TO "TontineFrequency";
DROP TYPE "TontineFrequency_old";
ALTER TABLE "tontine" ALTER COLUMN "frequency" SET DEFAULT 'MONTHLY';
COMMIT;
