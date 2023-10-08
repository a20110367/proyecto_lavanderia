/*
  Warnings:

  - You are about to drop the column `cateforyDes` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `cashCut` on the `DeliveryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `payDate` on the `DeliveryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `payMethod` on the `DeliveryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `DeliveryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_user` on the `DryMachineDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `DryMachineDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `cashCut` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `fk_user` on the `WashMachineDetail` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAT` on the `WashMachineDetail` table. All the data in the column will be lost.
  - Added the required column `categoryDescription` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryDate` to the `DeliveryDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryTime` to the `DeliveryDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DeliveryDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_staffMember` to the `DryMachineDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DryMachineDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receptionTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderServiceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payTime` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payTotal` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_staffMember` to the `WashMachineDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WashMachineDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DryMachineDetail` DROP FOREIGN KEY `DryMachineDetail_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `WashMachineDetail` DROP FOREIGN KEY `WashMachineDetail_fk_user_fkey`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `cateforyDes`,
    ADD COLUMN `categoryDescription` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Client` DROP COLUMN `updatedAT`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `DeliveryDetail` DROP COLUMN `cashCut`,
    DROP COLUMN `payDate`,
    DROP COLUMN `payMethod`,
    DROP COLUMN `updatedAT`,
    ADD COLUMN `deliveryDate` DATE NOT NULL,
    ADD COLUMN `deliveryTime` TIME NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `DryMachineDetail` DROP COLUMN `fk_user`,
    DROP COLUMN `updatedAT`,
    ADD COLUMN `dryDate` DATE NULL,
    ADD COLUMN `dryTime` TIME NULL,
    ADD COLUMN `fk_staffMember` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Machine` DROP COLUMN `updatedAT`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `updatedAT`,
    ADD COLUMN `deliveryTime` TIME NULL,
    ADD COLUMN `receptionTime` TIME NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `receptionDate` DATE NOT NULL,
    MODIFY `deliveryDate` DATE NOT NULL;

-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP COLUMN `updatedAT`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `cashCut`,
    DROP COLUMN `updatedAT`,
    ADD COLUMN `fk_cashCut` INTEGER NULL,
    ADD COLUMN `payTime` TIME NOT NULL,
    ADD COLUMN `payTotal` DOUBLE NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `payDate` DATE NOT NULL;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `updatedAT`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `updatedAT`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `WashMachineDetail` DROP COLUMN `fk_user`,
    DROP COLUMN `updatedAT`,
    ADD COLUMN `fk_staffMember` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `washDate` DATE NULL,
    ADD COLUMN `washTime` TIME NULL;

-- CreateTable
CREATE TABLE `StaffMember` (
    `id_staffMember` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `idToken` INTEGER NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StaffMember_email_key`(`email`),
    PRIMARY KEY (`id_staffMember`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashCut` (
    `id_chashCut` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user` INTEGER NOT NULL,
    `subtotal` DOUBLE NULL,
    `total` DOUBLE NULL,
    `subtotal_item1` DOUBLE NULL,
    `subtotal_item2` DOUBLE NULL,
    `subtotal_item3` DOUBLE NULL,
    `subtotal_item4` DOUBLE NULL,
    `subtotal_item5` DOUBLE NULL,
    `cashCutDate` DATE NOT NULL,
    `cashCutTime` TIME NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_chashCut`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WashMachineDetail` ADD CONSTRAINT `WashMachineDetail_fk_staffMember_fkey` FOREIGN KEY (`fk_staffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DryMachineDetail` ADD CONSTRAINT `DryMachineDetail_fk_staffMember_fkey` FOREIGN KEY (`fk_staffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_chashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CashCut` ADD CONSTRAINT `CashCut_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
