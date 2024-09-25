-- CreateEnum
CREATE TYPE "State" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('0', '1', '2', '3', '4');

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFlashcard" (
    "id" SERIAL NOT NULL,
    "due" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stability" DOUBLE PRECISION NOT NULL,
    "difficulty" DOUBLE PRECISION NOT NULL,
    "elapsed_days" INTEGER NOT NULL,
    "scheduled_days" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "lapses" INTEGER NOT NULL,
    "state" "State" NOT NULL DEFAULT '0',
    "last_review" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "flashcardId" INTEGER NOT NULL,

    CONSTRAINT "UserFlashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "openingPrompt" TEXT NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioSession" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scenarioId" INTEGER NOT NULL,
    "scenarioState" JSONB NOT NULL,

    CONSTRAINT "ScenarioSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_id_key" ON "Flashcard"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserFlashcard_id_key" ON "UserFlashcard"("id");

-- CreateIndex
CREATE INDEX "UserFlashcard_id_idx" ON "UserFlashcard"("id");

-- CreateIndex
CREATE INDEX "UserFlashcard_userId_idx" ON "UserFlashcard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_id_key" ON "Scenario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioSession_id_key" ON "ScenarioSession"("id");

-- CreateIndex
CREATE INDEX "ScenarioSession_sessionId_idx" ON "ScenarioSession"("sessionId");

-- AddForeignKey
ALTER TABLE "UserFlashcard" ADD CONSTRAINT "UserFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioSession" ADD CONSTRAINT "ScenarioSession_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
