/*
  Warnings:

  - You are about to drop the column `finishDate` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `finished` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `units` on the `OrderServiceDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ServiceTraceDetail` DROP FOREIGN KEY `ServiceTraceDetail_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceTraceDetail` DROP FOREIGN KEY `ServiceTraceDetail_fk_idOrderServiceDetail_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceTraceDetail` DROP FOREIGN KEY `ServiceTraceDetail_fk_staffMember_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP COLUMN `finishDate`,
    DROP COLUMN `finished`,
    DROP COLUMN `units`,
    ADD COLUMN `started` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idOrderServiceDetail_fkey` FOREIGN KEY (`fk_idOrderServiceDetail`) REFERENCES `OrderServiceDetail`(`id_OrderServiceDetail`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_staffMember_fkey` FOREIGN KEY (`fk_staffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE SET NULL ON UPDATE CASCADE;
