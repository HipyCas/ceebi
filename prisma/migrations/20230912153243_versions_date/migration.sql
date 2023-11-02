-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appProjectId" INTEGER NOT NULL,
    CONSTRAINT "AppVersion_appProjectId_fkey" FOREIGN KEY ("appProjectId") REFERENCES "AppProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AppVersion" ("appProjectId", "code", "id") SELECT "appProjectId", "code", "id" FROM "AppVersion";
DROP TABLE "AppVersion";
ALTER TABLE "new_AppVersion" RENAME TO "AppVersion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
