/*
  Warnings:

  - The primary key for the `LaundryService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_LaundryService` on the `LaundryService` table. All the data in the column will be lost.
  - You are about to drop the column `token_id` on the `LaundryService` table. All the data in the column will be lost.
  - The primary key for the `SelfService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_SelfService` on the `SelfService` table. All the data in the column will be lost.
  - The primary key for the `SelfServiceQueue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fk_SelfService` on the `SelfServiceQueue` table. All the data in the column will be lost.
  - You are about to drop the column `id_SelfServiceEvent` on the `SelfServiceQueue` table. All the data in the column will be lost.
  - Added the required column `id_laundryService` to the `LaundryService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_selfService` to the `SelfService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_selfServiceEvent` to the `SelfServiceQueue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `LaundryQueue` DROP FOREIGN KEY `LaundryQueue_fk_laundryService_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceQueue` DROP FOREIGN KEY `SelfServiceQueue_fk_SelfService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_LaundryService_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_SelfService_fkey`;

-- AlterTable
ALTER TABLE `IronQueue` ADD COLUMN `token_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `LaundryQueue` ADD COLUMN `token_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `LaundryService` DROP PRIMARY KEY,
    DROP COLUMN `id_LaundryService`,
    DROP COLUMN `token_id`,
    ADD COLUMN `id_laundryService` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_laundryService`);

-- AlterTable
ALTER TABLE `SelfService` DROP PRIMARY KEY,
    DROP COLUMN `id_SelfService`,
    ADD COLUMN `id_selfService` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_selfService`);

-- AlterTable
ALTER TABLE `SelfServiceQueue` DROP PRIMARY KEY,
    DROP COLUMN `fk_SelfService`,
    DROP COLUMN `id_SelfServiceEvent`,
    ADD COLUMN `fk_selfService` INTEGER NULL,
    ADD COLUMN `id_selfServiceEvent` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `token_id` INTEGER NULL,
    ADD PRIMARY KEY (`id_selfServiceEvent`);

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_LaundryService_fkey` FOREIGN KEY (`fk_LaundryService`) REFERENCES `LaundryService`(`id_laundryService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_SelfService_fkey` FOREIGN KEY (`fk_SelfService`) REFERENCES `SelfService`(`id_selfService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryQueue` ADD CONSTRAINT `LaundryQueue_fk_laundryService_fkey` FOREIGN KEY (`fk_laundryService`) REFERENCES `LaundryService`(`id_laundryService`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceQueue` ADD CONSTRAINT `SelfServiceQueue_fk_selfService_fkey` FOREIGN KEY (`fk_selfService`) REFERENCES `SelfService`(`id_selfService`) ON DELETE SET NULL ON UPDATE CASCADE;
