-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundle_id" TEXT,
    "frozen" BOOLEAN NOT NULL DEFAULT false,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "appId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "AppProject_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AppProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AppProject" ("appId", "bundle_id", "frozen", "id", "projectId") SELECT "appId", "bundle_id", "frozen", "id", "projectId" FROM "AppProject";
DROP TABLE "AppProject";
ALTER TABLE "new_AppProject" RENAME TO "AppProject";
CREATE UNIQUE INDEX "AppProject_appId_projectId_key" ON "AppProject"("appId", "projectId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
