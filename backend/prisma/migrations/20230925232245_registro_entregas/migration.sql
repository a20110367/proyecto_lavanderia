/*
  Warnings:

  - The values [finish] on the enum `Order_orderStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `fk_user` to the `DryMachineDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_user` to the `WashMachineDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DryMachineDetail` ADD COLUMN `fk_user` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `orderStatus` ENUM('pending', 'inProgress', 'finished', 'delivered') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `WashMachineDetail` ADD COLUMN `fk_user` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `DeliveryDetail` (
    `id_delivery` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idOrder` INTEGER NOT NULL,
    `fk_userCashier` INTEGER NOT NULL,
    `payMethod` ENUM('cash', 'credit') NOT NULL,
    `payDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cashCut` INTEGER NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAT` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DeliveryDetail_fk_idOrder_key`(`fk_idOrder`),
    PRIMARY KEY (`id_delivery`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WashMachineDetail` ADD CONSTRAINT `WashMachineDetail_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DryMachineDetail` ADD CONSTRAINT `DryMachineDetail_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_userCashier_fkey` FOREIGN KEY (`fk_userCashier`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
