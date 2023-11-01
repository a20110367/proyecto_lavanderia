/*
  Warnings:

  - You are about to drop the column `fk_idDryMachine` on the `LaundryDryQueue` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idWashMachine` on the `LaundryWashQueue` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idDryMachine` on the `SelfServiceDryQueue` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idWashMachine` on the `SelfServiceWashQueue` table. All the data in the column will be lost.
  - You are about to drop the `DryMachine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WashMachine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idDryMachine_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idWashMachine_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idDryMachine_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idWashMachine_fkey`;

-- AlterTable
ALTER TABLE `LaundryDryQueue` DROP COLUMN `fk_idDryMachine`,
    ADD COLUMN `fk_idMachine` INTEGER NULL;

-- AlterTable
ALTER TABLE `LaundryWashQueue` DROP COLUMN `fk_idWashMachine`,
    ADD COLUMN `fk_idMachine` INTEGER NULL;

-- AlterTable
ALTER TABLE `SelfServiceDryQueue` DROP COLUMN `fk_idDryMachine`,
    ADD COLUMN `fk_idMachine` INTEGER NULL;

-- AlterTable
ALTER TABLE `SelfServiceWashQueue` DROP COLUMN `fk_idWashMachine`,
    ADD COLUMN `fk_idMachine` INTEGER NULL;

-- DropTable
DROP TABLE `DryMachine`;

-- DropTable
DROP TABLE `WashMachine`;

-- CreateTable
CREATE TABLE `Machine` (
    `id_machine` INTEGER NOT NULL AUTO_INCREMENT,
    `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'lavadora',
    `model` VARCHAR(191) NOT NULL,
    `cicleTime` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `status` ENUM('available', 'unavailable') NOT NULL DEFAULT 'available',
    `freeForUse` BOOLEAN NOT NULL DEFAULT true,
    `notes` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL DEFAULT 'N/A',

    PRIMARY KEY (`id_machine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;
