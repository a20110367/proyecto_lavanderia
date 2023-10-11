/*
  Warnings:

  - The primary key for the `OrderServiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subtotal` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `idToken` on the `StaffMember` table. All the data in the column will be lost.
  - You are about to drop the `DryMachineDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WashMachineDetail` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `StaffMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_OrderServiceDetail` to the `OrderServiceDetail` table without a default value. This is not possible if the table is not empty.
  - Made the column `fk_cashCut` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstLN` to the `StaffMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondLN` to the `StaffMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DryMachineDetail` DROP FOREIGN KEY `DryMachineDetail_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `DryMachineDetail` DROP FOREIGN KEY `DryMachineDetail_fk_idOrder_fkey`;

-- DropForeignKey
ALTER TABLE `DryMachineDetail` DROP FOREIGN KEY `DryMachineDetail_fk_staffMember_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_cashCut_fkey`;

-- DropForeignKey
ALTER TABLE `WashMachineDetail` DROP FOREIGN KEY `WashMachineDetail_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `WashMachineDetail` DROP FOREIGN KEY `WashMachineDetail_fk_idOrder_fkey`;

-- DropForeignKey
ALTER TABLE `WashMachineDetail` DROP FOREIGN KEY `WashMachineDetail_fk_staffMember_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP PRIMARY KEY,
    DROP COLUMN `subtotal`,
    ADD COLUMN `id_OrderServiceDetail` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `fk_idService` INTEGER NOT NULL DEFAULT 1,
    MODIFY `fk_idOrder` INTEGER NOT NULL DEFAULT 1,
    MODIFY `finishDate` DATE NULL,
    ADD PRIMARY KEY (`id_OrderServiceDetail`);

-- AlterTable
ALTER TABLE `Payment` MODIFY `fk_cashCut` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `StaffMember` DROP COLUMN `idToken`,
    ADD COLUMN `firstLN` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_Token` INTEGER NULL,
    ADD COLUMN `secondLN` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `DryMachineDetail`;

-- DropTable
DROP TABLE `WashMachineDetail`;

-- CreateTable
CREATE TABLE `ServiceTraceDetail` (
    `fk_idOrder` INTEGER NOT NULL,
    `fk_idMachine` INTEGER NOT NULL,
    `fk_staffMember` INTEGER NOT NULL,
    `serviceDate` DATE NULL,
    `serviceTime` TIME NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`fk_idOrder`, `fk_idMachine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `StaffMember_phone_key` ON `StaffMember`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_staffMember_fkey` FOREIGN KEY (`fk_staffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_chashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;
