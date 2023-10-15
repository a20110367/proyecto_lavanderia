/*
  Warnings:

  - A unique constraint covering the columns `[fk_idPayment]` on the table `DeliveryDetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_idPayment` to the `DeliveryDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DeliveryDetail` DROP FOREIGN KEY `DeliveryDetail_fk_idOrder_fkey`;

-- AlterTable
ALTER TABLE `DeliveryDetail` ADD COLUMN `fk_idPayment` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DeliveryDetail_fk_idPayment_key` ON `DeliveryDetail`(`fk_idPayment`);

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idPayment_fkey` FOREIGN KEY (`fk_idPayment`) REFERENCES `Payment`(`id_payment`) ON DELETE NO ACTION ON UPDATE NO ACTION;
