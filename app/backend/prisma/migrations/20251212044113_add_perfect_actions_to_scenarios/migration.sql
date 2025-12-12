-- AlterTable
ALTER TABLE "Scenario" ADD COLUMN     "badActions" JSONB,
ADD COLUMN     "perfectActions" JSONB NOT NULL DEFAULT '[]';
