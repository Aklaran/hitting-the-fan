/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Flashcard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Scenario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `Scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Scenario" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_key_key" ON "Flashcard"("key");

-- CreateIndex
CREATE INDEX "Flashcard_key_idx" ON "Flashcard"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_key_key" ON "Scenario"("key");

-- CreateIndex
CREATE INDEX "Scenario_key_idx" ON "Scenario"("key");
