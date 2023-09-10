/*
  Warnings:

  - You are about to alter the column `receptionDate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deliveryDate` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `receptionDate` DATETIME NOT NULL,
    MODIFY `deliveryDate` DATETIME NOT NULL;
