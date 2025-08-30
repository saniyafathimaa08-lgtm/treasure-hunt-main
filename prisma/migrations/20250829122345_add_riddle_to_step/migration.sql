-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeamLocationStep" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "riddleId" INTEGER,
    CONSTRAINT "TeamLocationStep_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamLocationStep_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamLocationStep_riddleId_fkey" FOREIGN KEY ("riddleId") REFERENCES "Riddle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TeamLocationStep" ("id", "locationId", "position", "teamId") SELECT "id", "locationId", "position", "teamId" FROM "TeamLocationStep";
DROP TABLE "TeamLocationStep";
ALTER TABLE "new_TeamLocationStep" RENAME TO "TeamLocationStep";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
