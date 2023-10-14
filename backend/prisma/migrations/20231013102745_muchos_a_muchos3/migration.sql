/*
  Warnings:

  - You are about to drop the column `fk_idOrder` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idService` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - Added the required column `fk_Order` to the `OrderServiceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_Service` to the `OrderServiceDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderServiceDetail` DROP FOREIGN KEY `OrderServiceDetail_fk_idOrder_fkey`;

-- DropForeignKey
ALTER TABLE `OrderServiceDetail` DROP FOREIGN KEY `OrderServiceDetail_fk_idService_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP COLUMN `fk_idOrder`,
    DROP COLUMN `fk_idService`,
    ADD COLUMN `fk_Order` INTEGER NOT NULL,
    ADD COLUMN `fk_Service` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderServiceDetail` ADD CONSTRAINT `OrderServiceDetail_fk_Order_fkey` FOREIGN KEY (`fk_Order`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OrderServiceDetail` ADD CONSTRAINT `OrderServiceDetail_fk_Service_fkey` FOREIGN KEY (`fk_Service`) REFERENCES `Service`(`id_service`) ON DELETE NO ACTION ON UPDATE NO ACTION;
