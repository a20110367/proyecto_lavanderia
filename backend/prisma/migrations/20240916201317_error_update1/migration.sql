/*
  Warnings:

  - You are about to drop the column `fk_user` on the `CancelledServiceOrder` table. All the data in the column will be lost.
  - You are about to drop the column `fk_user` on the `CancelledSupplyOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CancelledServiceOrder` DROP FOREIGN KEY `CancelledServiceOrder_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `CancelledSupplyOrder` DROP FOREIGN KEY `CancelledSupplyOrder_fk_user_fkey`;

-- AlterTable
ALTER TABLE `CancelledServiceOrder` DROP COLUMN `fk_user`;

-- AlterTable
ALTER TABLE `CancelledSupplyOrder` DROP COLUMN `fk_user`;
