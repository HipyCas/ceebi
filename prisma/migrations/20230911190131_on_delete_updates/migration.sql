-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "limit_start_date" DATETIME,
    "limit_end_date" DATETIME,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "ProjectToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectToken" ("id", "limit_end_date", "limit_start_date", "organizationId") SELECT "id", "limit_end_date", "limit_start_date", "organizationId" FROM "ProjectToken";
DROP TABLE "ProjectToken";
ALTER TABLE "new_ProjectToken" RENAME TO "ProjectToken";
CREATE TABLE "new_AppProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundle_id" TEXT,
    "frozen" BOOLEAN NOT NULL DEFAULT false,
    "appId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "AppProject_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AppProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AppProject" ("appId", "bundle_id", "frozen", "id", "projectId") SELECT "appId", "bundle_id", "frozen", "id", "projectId" FROM "AppProject";
DROP TABLE "AppProject";
ALTER TABLE "new_AppProject" RENAME TO "AppProject";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
