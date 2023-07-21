/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_link_key" ON "Product"("link");
