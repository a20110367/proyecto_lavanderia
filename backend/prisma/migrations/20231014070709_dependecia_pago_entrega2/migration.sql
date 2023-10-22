/*
  Warnings:

  - You are about to drop the column `fk_idOrder` on the `DeliveryDetail` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `DeliveryDetail_fk_idOrder_key` ON `DeliveryDetail`;

-- AlterTable
ALTER TABLE `DeliveryDetail` DROP COLUMN `fk_idOrder`;
