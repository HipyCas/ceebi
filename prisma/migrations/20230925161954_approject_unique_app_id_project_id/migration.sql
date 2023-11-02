/*
  Warnings:

  - You are about to drop the column `notes` on the `AppVersion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appId,projectId]` on the table `AppProject` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appProjectId" INTEGER NOT NULL,
    CONSTRAINT "AppVersion_appProjectId_fkey" FOREIGN KEY ("appProjectId") REFERENCES "AppProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AppVersion" ("appProjectId", "code", "date", "id") SELECT "appProjectId", "code", "date", "id" FROM "AppVersion";
DROP TABLE "AppVersion";
ALTER TABLE "new_AppVersion" RENAME TO "AppVersion";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "AppProject_appId_projectId_key" ON "AppProject"("appId", "projectId");
