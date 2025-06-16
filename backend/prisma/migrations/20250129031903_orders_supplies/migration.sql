/*
  Warnings:

  - You are about to drop the column `ordersPayed` on the `SupplyCashCut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SupplyCashCut` DROP COLUMN `ordersPayed`,
    ADD COLUMN `ordersPayedSupply` INTEGER NULL;
