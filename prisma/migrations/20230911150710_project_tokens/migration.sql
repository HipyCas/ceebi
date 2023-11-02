-- CreateTable
CREATE TABLE "ProjectToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "limit_start_date" DATETIME,
    "limit_end_date" DATETIME,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "ProjectToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AppToProjectToken" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AppToProjectToken_A_fkey" FOREIGN KEY ("A") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AppToProjectToken_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppToProjectToken_AB_unique" ON "_AppToProjectToken"("A", "B");

-- CreateIndex
CREATE INDEX "_AppToProjectToken_B_index" ON "_AppToProjectToken"("B");
