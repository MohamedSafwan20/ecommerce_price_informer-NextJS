/*
  Warnings:

  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "orderedPrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "id", "imageUrl", "interval", "link", "name", "orderedPrice", "status", "store") SELECT "createdAt", "id", "imageUrl", "interval", "link", "name", "orderedPrice", "status", "store" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_link_key" ON "Product"("link");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
