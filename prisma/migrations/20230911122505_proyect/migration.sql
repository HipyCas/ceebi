-- CreateTable
CREATE TABLE "Proyect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "end" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    CONSTRAINT "Proyect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
