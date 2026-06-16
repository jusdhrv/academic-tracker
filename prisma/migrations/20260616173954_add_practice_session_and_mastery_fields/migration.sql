-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionDuration" INTEGER NOT NULL,
    "targetTimePerQuestion" REAL NOT NULL,
    "selectedQuestions" TEXT NOT NULL,
    "filterCriteria" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PracticeQuestionAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME NOT NULL,
    "elapsedSeconds" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PracticeQuestionAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PracticeQuestionAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "questionNumber" INTEGER,
    "sourceId" TEXT NOT NULL,
    "difficultyId" TEXT NOT NULL,
    "isDue" BOOLEAN NOT NULL DEFAULT false,
    "masteryScore" REAL NOT NULL DEFAULT 0.5,
    "lastSeen" DATETIME,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "fastSuccesses" INTEGER NOT NULL DEFAULT 0,
    "slowSuccesses" INTEGER NOT NULL DEFAULT 0,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "skips" INTEGER NOT NULL DEFAULT 0,
    "consecutiveFastSuccesses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_difficultyId_fkey" FOREIGN KEY ("difficultyId") REFERENCES "Difficulty" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("content", "createdAt", "difficultyId", "id", "isDue", "questionNumber", "sourceId", "updatedAt") SELECT "content", "createdAt", "difficultyId", "id", "isDue", "questionNumber", "sourceId", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PracticeQuestionAttempt_sessionId_idx" ON "PracticeQuestionAttempt"("sessionId");

-- CreateIndex
CREATE INDEX "PracticeQuestionAttempt_questionId_idx" ON "PracticeQuestionAttempt"("questionId");
