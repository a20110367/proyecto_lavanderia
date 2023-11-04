/*
  Warnings:

  - The primary key for the `IronStation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_IronStation` on the `IronStation` table. All the data in the column will be lost.
  - You are about to drop the column `dryCycles` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `pieces` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `washCycles` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `Machine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderIronServiceDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderLaundryServiceDetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_ironStation` to the `IronStation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DeliveryDetail` DROP FOREIGN KEY `DeliveryDetail_fk_idOrder_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_client_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `OrderIronServiceDetail` DROP FOREIGN KEY `OrderIronServiceDetail_fk_Order_fkey`;

-- DropForeignKey
ALTER TABLE `OrderIronServiceDetail` DROP FOREIGN KEY `OrderIronServiceDetail_fk_Service_fkey`;

-- DropForeignKey
ALTER TABLE `OrderIronServiceDetail` DROP FOREIGN KEY `OrderIronServiceDetail_fk_idIronStation_fkey`;

-- DropForeignKey
ALTER TABLE `OrderIronServiceDetail` DROP FOREIGN KEY `OrderIronServiceDetail_fk_idStaffMember_fkey`;

-- DropForeignKey
ALTER TABLE `OrderLaundryServiceDetail` DROP FOREIGN KEY `OrderLaundryServiceDetail_fk_Order_fkey`;

-- DropForeignKey
ALTER TABLE `OrderLaundryServiceDetail` DROP FOREIGN KEY `OrderLaundryServiceDetail_fk_Service_fkey`;

-- DropForeignKey
ALTER TABLE `OrderLaundryServiceDetail` DROP FOREIGN KEY `OrderLaundryServiceDetail_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `OrderLaundryServiceDetail` DROP FOREIGN KEY `OrderLaundryServiceDetail_fk_idStaffMember_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_idOrder_fkey`;

-- AlterTable
ALTER TABLE `IronStation` DROP PRIMARY KEY,
    DROP COLUMN `id_IronStation`,
    ADD COLUMN `freeForUse` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `id_ironStation` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'plancha',
    ADD PRIMARY KEY (`id_ironStation`);

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `dryCycles`,
    DROP COLUMN `pieces`,
    DROP COLUMN `time`,
    DROP COLUMN `washCycles`,
    DROP COLUMN `weight`;

-- DropTable
DROP TABLE `Machine`;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `OrderIronServiceDetail`;

-- DropTable
DROP TABLE `OrderLaundryServiceDetail`;

-- CreateTable
CREATE TABLE `WashMachine` (
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

-- CreateTable
CREATE TABLE `DryMachine` (
    `id_machine` INTEGER NOT NULL AUTO_INCREMENT,
    `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'secadora',
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

-- CreateTable
CREATE TABLE `WashService` (
    `id_washService` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idService` INTEGER NOT NULL,
    `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'lavadora',
    `weight` INTEGER NOT NULL,
    `cycleTime` INTEGER NOT NULL,

    PRIMARY KEY (`id_washService`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DryService` (
    `id_dryService` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idService` INTEGER NOT NULL,
    `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'secadora',
    `weight` INTEGER NOT NULL,
    `cycleTime` INTEGER NOT NULL,

    PRIMARY KEY (`id_dryService`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IronService` (
    `id_ironService` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idService` INTEGER NOT NULL,
    `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'plancha',
    `pieces` INTEGER NOT NULL,
    `cycleTime` INTEGER NOT NULL,

    PRIMARY KEY (`id_ironService`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceOrder` (
    `id_order` INTEGER NOT NULL AUTO_INCREMENT,
    `receptionDate` DATE NOT NULL,
    `orderStatus` ENUM('pending', 'inProgress', 'finished', 'delivered', 'stored') NOT NULL DEFAULT 'pending',
    `totalPrice` DOUBLE NOT NULL,
    `fk_client` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `numberOfItems` INTEGER NOT NULL DEFAULT 1,
    `payForm` ENUM('advance', 'delivery') NOT NULL DEFAULT 'delivery',
    `payStatus` ENUM('paid', 'unpaid') NOT NULL DEFAULT 'unpaid',
    `receptionTime` TIME(0) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `scheduledDeliveryDate` DATE NOT NULL,
    `scheduledDeliveryTime` TIME(0) NULL,
    `fk_categoryId` INTEGER NOT NULL,
    `fk_deliveryDetail` INTEGER NULL,
    `token` INTEGER NULL,

    PRIMARY KEY (`id_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceOrderDetail` (
    `id_serviceOrderDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_ServiceOrder` INTEGER NOT NULL,
    `fk_Service` INTEGER NOT NULL,

    PRIMARY KEY (`id_serviceOrderDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaundryWashQueue` (
    `id_washEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idWashService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_idWashMachine` INTEGER NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_washEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfServiceWashQueue` (
    `id_washEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idWashService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idWashMachine` INTEGER NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_washEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaundryDryQueue` (
    `id_dryEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idDryService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_idDryMachine` INTEGER NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_dryEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfServiceDryQueue` (
    `id_dryEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idDryService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idDryMachine` INTEGER NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_dryEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IronQueue` (
    `id_ironEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idIronService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_idIronStation` INTEGER NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_ironEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WashService` ADD CONSTRAINT `WashService_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DryService` ADD CONSTRAINT `DryService_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronService` ADD CONSTRAINT `IronService_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_fk_categoryId_fkey` FOREIGN KEY (`fk_categoryId`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_ServiceOrder_fkey` FOREIGN KEY (`fk_ServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_Service_fkey` FOREIGN KEY (`fk_Service`) REFERENCES `Service`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idWashMachine_fkey` FOREIGN KEY (`fk_idWashMachine`) REFERENCES `WashMachine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idWashService_fkey` FOREIGN KEY (`fk_idWashService`) REFERENCES `WashService`(`id_washService`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idWashMachine_fkey` FOREIGN KEY (`fk_idWashMachine`) REFERENCES `WashMachine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idWashService_fkey` FOREIGN KEY (`fk_idWashService`) REFERENCES `WashService`(`id_washService`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idDryMachine_fkey` FOREIGN KEY (`fk_idDryMachine`) REFERENCES `DryMachine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idDryService_fkey` FOREIGN KEY (`fk_idDryService`) REFERENCES `DryService`(`id_dryService`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idDryMachine_fkey` FOREIGN KEY (`fk_idDryMachine`) REFERENCES `DryMachine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idDryService_fkey` FOREIGN KEY (`fk_idDryService`) REFERENCES `DryService`(`id_dryService`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idIronStation_fkey` FOREIGN KEY (`fk_idIronStation`) REFERENCES `IronStation`(`id_ironStation`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idIronService_fkey` FOREIGN KEY (`fk_idIronService`) REFERENCES `IronService`(`id_ironService`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;
