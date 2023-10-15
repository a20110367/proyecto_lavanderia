/*
  Warnings:

  - The primary key for the `OrderServiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fk_idOrder` on the `ServiceTraceDetail` table. All the data in the column will be lost.
  - You are about to drop the `_ClientToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MachineToStaffMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderToService` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_OrderServiceDetail` to the `OrderServiceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_idOrderServiceDetail` to the `ServiceTraceDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ServiceTraceDetail` DROP FOREIGN KEY `ServiceTraceDetail_fk_idOrder_fkey`;

-- DropForeignKey
ALTER TABLE `_ClientToUser` DROP FOREIGN KEY `_ClientToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ClientToUser` DROP FOREIGN KEY `_ClientToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_MachineToStaffMember` DROP FOREIGN KEY `_MachineToStaffMember_A_fkey`;

-- DropForeignKey
ALTER TABLE `_MachineToStaffMember` DROP FOREIGN KEY `_MachineToStaffMember_B_fkey`;

-- DropForeignKey
ALTER TABLE `_OrderToService` DROP FOREIGN KEY `_OrderToService_A_fkey`;

-- DropForeignKey
ALTER TABLE `_OrderToService` DROP FOREIGN KEY `_OrderToService_B_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP PRIMARY KEY,
    ADD COLUMN `id_OrderServiceDetail` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_OrderServiceDetail`);

-- AlterTable
ALTER TABLE `ServiceTraceDetail` DROP COLUMN `fk_idOrder`,
    ADD COLUMN `fk_idOrderServiceDetail` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_ClientToUser`;

-- DropTable
DROP TABLE `_MachineToStaffMember`;

-- DropTable
DROP TABLE `_OrderToService`;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idOrderServiceDetail_fkey` FOREIGN KEY (`fk_idOrderServiceDetail`) REFERENCES `OrderServiceDetail`(`id_OrderServiceDetail`) ON DELETE NO ACTION ON UPDATE NO ACTION;
