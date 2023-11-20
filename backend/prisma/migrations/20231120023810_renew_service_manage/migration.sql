/*
  Warnings:

  - You are about to drop the column `isDone` on the `IronQueue` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idService` on the `IronService` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `ServiceOrder` table. All the data in the column will be lost.
  - You are about to drop the column `fk_Service` on the `ServiceOrderDetail` table. All the data in the column will be lost.
  - You are about to drop the `DryService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LaundryDryQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LaundryWashQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelfServiceDryQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelfServiceWashQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WashService` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[description]` on the table `IronService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `IronService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `IronService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `IronService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DryService` DROP FOREIGN KEY `DryService_fk_idService_fkey`;

-- DropForeignKey
ALTER TABLE `IronService` DROP FOREIGN KEY `IronService_fk_idService_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idDryService_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idStaffMember_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idStaffMember_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idWashService_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idDryService_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idWashService_fkey`;

-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_Service_fkey`;

-- DropForeignKey
ALTER TABLE `WashService` DROP FOREIGN KEY `WashService_fk_idService_fkey`;

-- AlterTable
ALTER TABLE `IronQueue` DROP COLUMN `isDone`,
    ADD COLUMN `serviceStatus` ENUM('pending', 'inProgress', 'finished') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `IronService` DROP COLUMN `fk_idService`,
    ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `ServiceOrder` DROP COLUMN `token`;

-- AlterTable
ALTER TABLE `ServiceOrderDetail` DROP COLUMN `fk_Service`,
    ADD COLUMN `fk_IronService` INTEGER NULL,
    ADD COLUMN `fk_LaundryService` INTEGER NULL,
    ADD COLUMN `fk_SelfService` INTEGER NULL;

-- DropTable
DROP TABLE `DryService`;

-- DropTable
DROP TABLE `LaundryDryQueue`;

-- DropTable
DROP TABLE `LaundryWashQueue`;

-- DropTable
DROP TABLE `SelfServiceDryQueue`;

-- DropTable
DROP TABLE `SelfServiceWashQueue`;

-- DropTable
DROP TABLE `Service`;

-- DropTable
DROP TABLE `WashService`;

-- CreateTable
CREATE TABLE `SelfService` (
    `id_SelfService` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `weight` INTEGER NOT NULL,
    `cycleTime` INTEGER NOT NULL,
    `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `category_id` INTEGER NOT NULL,

    UNIQUE INDEX `SelfService_description_key`(`description`),
    PRIMARY KEY (`id_SelfService`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaundryService` (
    `id_LaundryService` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `washWeight` INTEGER NOT NULL,
    `washCycleTime` INTEGER NOT NULL,
    `dryWeight` INTEGER NOT NULL,
    `dryCycleTime` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `category_id` INTEGER NOT NULL,

    UNIQUE INDEX `LaundryService_description_key`(`description`),
    PRIMARY KEY (`id_LaundryService`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaundryQueue` (
    `id_laundryEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `id_description` VARCHAR(191) NOT NULL,
    `fk_laundryService` INTEGER NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_washDetail` INTEGER NULL,
    `fk_dryDetail` INTEGER NULL,
    `serviceStatus` ENUM('pending', 'inProgress', 'finished') NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id_laundryEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WashDetail` (
    `id_washDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idWashStaffMember` INTEGER NULL,
    `fk_idWashMachine` INTEGER NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_laundryEvent` INTEGER NULL,

    UNIQUE INDEX `WashDetail_fk_laundryEvent_key`(`fk_laundryEvent`),
    PRIMARY KEY (`id_washDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DryDetail` (
    `id_dryDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idDryStaffMember` INTEGER NULL,
    `fk_idDryMachine` INTEGER NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_laundryEvent` INTEGER NULL,

    UNIQUE INDEX `DryDetail_fk_laundryEvent_key`(`fk_laundryEvent`),
    PRIMARY KEY (`id_dryDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfServiceQueue` (
    `id_SelfServiceEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `id_description` VARCHAR(191) NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_SelfService` INTEGER NULL,
    `fk_idMachine` INTEGER NULL,
    `serviceStatus` ENUM('pending', 'inProgress', 'finished') NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id_SelfServiceEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `IronService_description_key` ON `IronService`(`description`);

-- AddForeignKey
ALTER TABLE `IronService` ADD CONSTRAINT `IronService_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfService` ADD CONSTRAINT `SelfService_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryService` ADD CONSTRAINT `LaundryService_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_LaundryService_fkey` FOREIGN KEY (`fk_LaundryService`) REFERENCES `LaundryService`(`id_LaundryService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_SelfService_fkey` FOREIGN KEY (`fk_SelfService`) REFERENCES `SelfService`(`id_SelfService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_IronService_fkey` FOREIGN KEY (`fk_IronService`) REFERENCES `IronService`(`id_ironService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryQueue` ADD CONSTRAINT `LaundryQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryQueue` ADD CONSTRAINT `LaundryQueue_fk_laundryService_fkey` FOREIGN KEY (`fk_laundryService`) REFERENCES `LaundryService`(`id_LaundryService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WashDetail` ADD CONSTRAINT `WashDetail_fk_laundryEvent_fkey` FOREIGN KEY (`fk_laundryEvent`) REFERENCES `LaundryQueue`(`id_laundryEvent`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WashDetail` ADD CONSTRAINT `WashDetail_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DryDetail` ADD CONSTRAINT `DryDetail_fk_laundryEvent_fkey` FOREIGN KEY (`fk_laundryEvent`) REFERENCES `LaundryQueue`(`id_laundryEvent`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DryDetail` ADD CONSTRAINT `DryDetail_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceQueue` ADD CONSTRAINT `SelfServiceQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceQueue` ADD CONSTRAINT `SelfServiceQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceQueue` ADD CONSTRAINT `SelfServiceQueue_fk_SelfService_fkey` FOREIGN KEY (`fk_SelfService`) REFERENCES `SelfService`(`id_SelfService`) ON DELETE SET NULL ON UPDATE CASCADE;
