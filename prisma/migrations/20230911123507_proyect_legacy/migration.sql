-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proyect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "end" DATETIME NOT NULL,
    "legacy" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Proyect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Proyect" ("end", "id", "name", "organizationId", "status") SELECT "end", "id", "name", "organizationId", "status" FROM "Proyect";
DROP TABLE "Proyect";
ALTER TABLE "new_Proyect" RENAME TO "Proyect";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
