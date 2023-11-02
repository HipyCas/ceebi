-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AppProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bundle_id" TEXT,
    "frozen" BOOLEAN NOT NULL DEFAULT false,
    "appId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "AppProject_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AppProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AppVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "appProjectId" INTEGER NOT NULL,
    CONSTRAINT "AppVersion_appProjectId_fkey" FOREIGN KEY ("appProjectId") REFERENCES "AppProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
