/*
  Warnings:

  - A unique constraint covering the columns `[fk_idOrder]` on the table `DeliveryDetail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_idOrder` to the `DeliveryDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DeliveryDetail` ADD COLUMN `fk_idOrder` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `fk_deliveryDetail` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `DeliveryDetail_fk_idOrder_key` ON `DeliveryDetail`(`fk_idOrder`);

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;
