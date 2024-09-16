/*
  Warnings:

  - Added the required column `fk_user` to the `CancelledServiceOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_user` to the `CancelledSupplyOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CancelledServiceOrder` ADD COLUMN `fk_user` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CancelledSupplyOrder` ADD COLUMN `fk_user` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrder` ADD CONSTRAINT `CancelledServiceOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledSupplyOrder` ADD CONSTRAINT `CancelledSupplyOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
