/*
  Warnings:

  - You are about to drop the column `fk_IronService` on the `ServiceOrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_LaundryService` on the `ServiceOrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_SelfService` on the `ServiceOrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_ServiceOrder` on the `ServiceOrderDetail` table. All the data in the column will be lost.
  - Added the required column `fk_serviceOrder` to the `ServiceOrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_IronService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_LaundryService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_SelfService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_ServiceOrder_fkey`;

-- AlterTable
ALTER TABLE `ServiceOrderDetail` DROP COLUMN `fk_IronService`,
    DROP COLUMN `fk_LaundryService`,
    DROP COLUMN `fk_SelfService`,
    DROP COLUMN `fk_ServiceOrder`,
    ADD COLUMN `fk_ironService` INTEGER NULL,
    ADD COLUMN `fk_laundryService` INTEGER NULL,
    ADD COLUMN `fk_selfService` INTEGER NULL,
    ADD COLUMN `fk_serviceOrder` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_serviceOrder_fkey` FOREIGN KEY (`fk_serviceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_laundryService_fkey` FOREIGN KEY (`fk_laundryService`) REFERENCES `LaundryService`(`id_laundryService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_selfService_fkey` FOREIGN KEY (`fk_selfService`) REFERENCES `SelfService`(`id_selfService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_ironService_fkey` FOREIGN KEY (`fk_ironService`) REFERENCES `IronService`(`id_ironService`) ON DELETE SET NULL ON UPDATE CASCADE;
