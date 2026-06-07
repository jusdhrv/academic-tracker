-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Concept" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "chapterId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Concept_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_Concept" ("id", "name", "slug", "createdAt", "updatedAt", "chapterId")
SELECT "id", "name", "slug", "createdAt", "updatedAt", NULL FROM "Concept";

DROP TABLE "Concept";
ALTER TABLE "new_Concept" RENAME TO "Concept";
CREATE UNIQUE INDEX "Concept_chapterId_slug_key" ON "Concept"("chapterId", "slug");

CREATE TABLE "new_Chapter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL DEFAULT 'CHAPTER',
    "catalogQuestionCount" INTEGER,
    "subjectId" TEXT NOT NULL,
    "sourceId" TEXT,
    "parentId" TEXT,
    "displayDifficultyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Chapter_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chapter_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Chapter_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chapter_displayDifficultyId_fkey" FOREIGN KEY ("displayDifficultyId") REFERENCES "Difficulty" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_Chapter" ("id", "name", "slug", "nodeType", "catalogQuestionCount", "subjectId", "parentId", "displayDifficultyId", "createdAt", "updatedAt", "sourceId")
SELECT "id", "name", "slug", "nodeType", "catalogQuestionCount", "subjectId", "parentId", "displayDifficultyId", "createdAt", "updatedAt", NULL FROM "Chapter";

DROP TABLE "Chapter";
ALTER TABLE "new_Chapter" RENAME TO "Chapter";
CREATE UNIQUE INDEX "Chapter_subjectId_slug_key" ON "Chapter"("subjectId", "slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
