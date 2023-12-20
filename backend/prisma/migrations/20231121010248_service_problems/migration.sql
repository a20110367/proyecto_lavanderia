/*
  Warnings:

  - The primary key for the `IronService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_ironService` on the `IronService` table. All the data in the column will be lost.
  - The primary key for the `LaundryService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_laundryService` on the `LaundryService` table. All the data in the column will be lost.
  - The primary key for the `SelfService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_selfService` on the `SelfService` table. All the data in the column will be lost.
  - The primary key for the `SelfServiceQueue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_selfServiceEvent` on the `SelfServiceQueue` table. All the data in the column will be lost.
  - Added the required column `id_service` to the `IronService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_service` to the `LaundryService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_service` to the `SelfService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_serviceEvent` to the `SelfServiceQueue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `IronQueue` DROP FOREIGN KEY `IronQueue_fk_idIronService_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryQueue` DROP FOREIGN KEY `LaundryQueue_fk_laundryService_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceQueue` DROP FOREIGN KEY `SelfServiceQueue_fk_selfService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_ironService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_laundryService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_selfService_fkey`;

-- AlterTable
ALTER TABLE `IronService` DROP PRIMARY KEY,
    DROP COLUMN `id_ironService`,
    ADD COLUMN `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_service`);

-- AlterTable
ALTER TABLE `LaundryService` DROP PRIMARY KEY,
    DROP COLUMN `id_laundryService`,
    ADD COLUMN `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_service`);

-- AlterTable
ALTER TABLE `SelfService` DROP PRIMARY KEY,
    DROP COLUMN `id_selfService`,
    ADD COLUMN `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_service`);

-- AlterTable
ALTER TABLE `SelfServiceQueue` DROP PRIMARY KEY,
    DROP COLUMN `id_selfServiceEvent`,
    ADD COLUMN `id_serviceEvent` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_serviceEvent`);

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_laundryService_fkey` FOREIGN KEY (`fk_laundryService`) REFERENCES `LaundryService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_selfService_fkey` FOREIGN KEY (`fk_selfService`) REFERENCES `SelfService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_ironService_fkey` FOREIGN KEY (`fk_ironService`) REFERENCES `IronService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryQueue` ADD CONSTRAINT `LaundryQueue_fk_laundryService_fkey` FOREIGN KEY (`fk_laundryService`) REFERENCES `LaundryService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceQueue` ADD CONSTRAINT `SelfServiceQueue_fk_selfService_fkey` FOREIGN KEY (`fk_selfService`) REFERENCES `SelfService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idIronService_fkey` FOREIGN KEY (`fk_idIronService`) REFERENCES `IronService`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;
