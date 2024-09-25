/*
  Warnings:

  - Added the required column `initialState` to the `Scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scenario" ADD COLUMN     "initialState" JSONB NOT NULL;
