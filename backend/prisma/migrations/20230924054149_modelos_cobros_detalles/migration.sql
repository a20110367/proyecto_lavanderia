/*
  Warnings:

  - You are about to drop the column `firstName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `fk_service` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `units` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `orderStatus` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(5))`.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fk_category]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstLN` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAT` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAT` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAT` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_category` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAT` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstLN` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondLN` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAT` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_client_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_employee_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_service_fkey`;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `firstName`,
    DROP COLUMN `secondName`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `firstLN` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondLN` VARCHAR(191) NULL,
    ADD COLUMN `updatedAT` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAT` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `fk_service`,
    DROP COLUMN `payMethod`,
    DROP COLUMN `units`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `numberOfItems` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `payForm` ENUM('advance', 'delivery') NOT NULL DEFAULT 'delivery',
    ADD COLUMN `payStatus` ENUM('paid', 'unpaid') NOT NULL DEFAULT 'unpaid',
    ADD COLUMN `updatedAT` DATETIME(3) NOT NULL,
    MODIFY `receptionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `deliveryDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `orderStatus` ENUM('pending', 'inProgress', 'finish') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fk_category` INTEGER NOT NULL,
    ADD COLUMN `pieces` INTEGER NULL,
    ADD COLUMN `updatedAT` DATETIME(3) NOT NULL,
    MODIFY `time` INTEGER NULL,
    MODIFY `weight` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstName`,
    DROP COLUMN `secondName`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `firstLN` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondLN` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAT` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Category` (
    `id_category` INTEGER NOT NULL AUTO_INCREMENT,
    `cateforyDes` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderServiceDetail` (
    `fk_idService` INTEGER NOT NULL,
    `fk_idOrder` INTEGER NOT NULL,
    `units` INTEGER NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `finishDate` DATETIME(3) NULL,
    `token` INTEGER NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAT` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrderServiceDetail_fk_idService_key`(`fk_idService`),
    UNIQUE INDEX `OrderServiceDetail_fk_idOrder_key`(`fk_idOrder`),
    PRIMARY KEY (`fk_idOrder`, `fk_idService`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WashMachineDetail` (
    `fk_idOrder` INTEGER NOT NULL,
    `fk_idMachine` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAT` DATETIME(3) NOT NULL,

    PRIMARY KEY (`fk_idOrder`, `fk_idMachine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DryMachineDetail` (
    `fk_idOrder` INTEGER NOT NULL,
    `fk_idMachine` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAT` DATETIME(3) NOT NULL,

    PRIMARY KEY (`fk_idOrder`, `fk_idMachine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id_payment` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idOrder` INTEGER NOT NULL,
    `fk_userCashier` INTEGER NOT NULL,
    `payMethod` ENUM('cash', 'credit') NOT NULL,
    `payDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cashCut` INTEGER NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAT` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_fk_idOrder_key`(`fk_idOrder`),
    PRIMARY KEY (`id_payment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Service_fk_category_key` ON `Service`(`fk_category`);

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_fk_category_fkey` FOREIGN KEY (`fk_category`) REFERENCES `Category`(`id_category`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_employee_fkey` FOREIGN KEY (`fk_employee`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderServiceDetail` ADD CONSTRAINT `OrderServiceDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `OrderServiceDetail` ADD CONSTRAINT `OrderServiceDetail_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `WashMachineDetail` ADD CONSTRAINT `WashMachineDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `WashMachineDetail` ADD CONSTRAINT `WashMachineDetail_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DryMachineDetail` ADD CONSTRAINT `DryMachineDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DryMachineDetail` ADD CONSTRAINT `DryMachineDetail_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_userCashier_fkey` FOREIGN KEY (`fk_userCashier`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
