/*
  Warnings:

  - You are about to drop the column `firstName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `fk_employee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `fk_service` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payMethod` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `units` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `orderStatus` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(3))`.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secondName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstLN` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_categoryDescription` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_user` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receptionTime` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledDeliveryDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstLN` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondLN` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
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
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `serialNumber` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'lavadora';

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `deliveryDate`,
    DROP COLUMN `fk_employee`,
    DROP COLUMN `fk_service`,
    DROP COLUMN `payMethod`,
    DROP COLUMN `units`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fk_categoryDescription` VARCHAR(191) NOT NULL,
    ADD COLUMN `fk_deliveryDetail` INTEGER NULL,
    ADD COLUMN `fk_user` INTEGER NOT NULL,
    ADD COLUMN `numberOfItems` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `payForm` ENUM('advance', 'delivery') NOT NULL DEFAULT 'delivery',
    ADD COLUMN `payStatus` ENUM('paid', 'unpaid') NOT NULL DEFAULT 'unpaid',
    ADD COLUMN `receptionTime` TIME(0) NOT NULL,
    ADD COLUMN `scheduledDeliveryDate` DATE NOT NULL,
    ADD COLUMN `scheduledDeliveryTime` TIME(0) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `receptionDate` DATE NOT NULL,
    MODIFY `orderStatus` ENUM('pending', 'inProgress', 'finished', 'delivered', 'stored') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dryCycles` INTEGER NULL,
    ADD COLUMN `pieces` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `washCycles` INTEGER NULL,
    MODIFY `time` INTEGER NULL,
    MODIFY `weight` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstName`,
    DROP COLUMN `secondName`,
    ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `firstLN` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondLN` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Category` (
    `id_category` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryDescription` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_categoryDescription_key`(`categoryDescription`),
    PRIMARY KEY (`id_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderLaundryServiceDetail` (
    `token` INTEGER NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_OrderLaundryDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_Order` INTEGER NOT NULL,
    `fk_Service` INTEGER NOT NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_idMachine` INTEGER NULL,
    `started` BOOLEAN NOT NULL DEFAULT false,
    `finished` BOOLEAN NOT NULL DEFAULT false,

    INDEX `OrderServiceDetail_fk_Order_fkey`(`fk_Order`),
    INDEX `OrderServiceDetail_fk_Service_fkey`(`fk_Service`),
    PRIMARY KEY (`id_OrderLaundryDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderIronServiceDetail` (
    `token` INTEGER NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `id_OrderIronDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_Order` INTEGER NOT NULL,
    `fk_Service` INTEGER NOT NULL,
    `fk_idStaffMember` INTEGER NULL,
    `fk_idIronStation` INTEGER NULL,
    `started` BOOLEAN NOT NULL DEFAULT false,
    `finished` BOOLEAN NOT NULL DEFAULT false,

    INDEX `OrderServiceDetail_fk_Order_fkey`(`fk_Order`),
    INDEX `OrderServiceDetail_fk_Service_fkey`(`fk_Service`),
    PRIMARY KEY (`id_OrderIronDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IronStation` (
    `id_IronStation` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('available', 'unavailable') NOT NULL DEFAULT 'available',
    `pieces` INTEGER NULL,
    `notes` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL DEFAULT 'N/A',
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_IronStation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id_payment` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idOrder` INTEGER NOT NULL,
    `payMethod` ENUM('cash', 'credit') NOT NULL,
    `payDate` DATE NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_cashCut` INTEGER NOT NULL,
    `payTime` TIME(0) NOT NULL,
    `payTotal` DOUBLE NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_fk_idOrder_key`(`fk_idOrder`),
    INDEX `Payment_fk_cashCut_fkey`(`fk_cashCut`),
    PRIMARY KEY (`id_payment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliveryDetail` (
    `id_delivery` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_userCashier` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deliveryDate` DATE NOT NULL,
    `deliveryTime` TIME(0) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_idOrder` INTEGER NOT NULL,
    `fk_idPayment` INTEGER NOT NULL,

    UNIQUE INDEX `DeliveryDetail_fk_idOrder_key`(`fk_idOrder`),
    UNIQUE INDEX `DeliveryDetail_fk_idPayment_key`(`fk_idPayment`),
    INDEX `DeliveryDetail_fk_userCashier_fkey`(`fk_userCashier`),
    PRIMARY KEY (`id_delivery`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffMember` (
    `id_staffMember` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `firstLN` VARCHAR(191) NOT NULL,
    `id_Token` INTEGER NULL,
    `secondLN` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StaffMember_email_key`(`email`),
    UNIQUE INDEX `StaffMember_phone_key`(`phone`),
    PRIMARY KEY (`id_staffMember`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashCut` (
    `fk_user` INTEGER NOT NULL,
    `total` DOUBLE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cashCutD` DATE NULL,
    `cashCutT` TIME(0) NULL,
    `id_cashCut` INTEGER NOT NULL AUTO_INCREMENT,
    `cashCutStatus` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    `inicialCash` DOUBLE NULL DEFAULT 0,
    `ordersPayed` INTEGER NULL,
    `toalAutoservicio` DOUBLE NULL,
    `totalCash` DOUBLE NULL,
    `totalCashWithdrawal` DOUBLE NULL,
    `totalCredit` DOUBLE NULL,
    `totalEncargo` DOUBLE NULL,
    `totalOtros` DOUBLE NULL DEFAULT 0,
    `totalPlanchado` DOUBLE NULL,
    `totalIncome` DOUBLE NULL,

    INDEX `CashCut_fk_user_fkey`(`fk_user`),
    PRIMARY KEY (`id_cashCut`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashWhithdrawal` (
    `id_cashWhithdrawal` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_cashCut` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `cashWhithdrawalType` ENUM('withdrawal', 'refound') NOT NULL DEFAULT 'withdrawal',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `date` DATE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CashWhithdrawal_fk_cashCut_fkey`(`fk_cashCut`),
    INDEX `CashWhithdrawal_fk_user_fkey`(`fk_user`),
    PRIMARY KEY (`id_cashWhithdrawal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Client_phone_key` ON `Client`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_username_key` ON `Client`(`username`);

-- CreateIndex
CREATE INDEX `Order_fk_categoryDescription_fkey` ON `Order`(`fk_categoryDescription`);

-- CreateIndex
CREATE INDEX `Order_fk_user_fkey` ON `Order`(`fk_user`);

-- CreateIndex
CREATE INDEX `Service_category_id_fkey` ON `Service`(`category_id`);

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_categoryDescription_fkey` FOREIGN KEY (`fk_categoryDescription`) REFERENCES `Category`(`categoryDescription`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderLaundryServiceDetail` ADD CONSTRAINT `OrderLaundryServiceDetail_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderLaundryServiceDetail` ADD CONSTRAINT `OrderLaundryServiceDetail_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderLaundryServiceDetail` ADD CONSTRAINT `OrderLaundryServiceDetail_fk_Order_fkey` FOREIGN KEY (`fk_Order`) REFERENCES `Order`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderLaundryServiceDetail` ADD CONSTRAINT `OrderLaundryServiceDetail_fk_Service_fkey` FOREIGN KEY (`fk_Service`) REFERENCES `Service`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderIronServiceDetail` ADD CONSTRAINT `OrderIronServiceDetail_fk_idIronStation_fkey` FOREIGN KEY (`fk_idIronStation`) REFERENCES `IronStation`(`id_IronStation`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderIronServiceDetail` ADD CONSTRAINT `OrderIronServiceDetail_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderIronServiceDetail` ADD CONSTRAINT `OrderIronServiceDetail_fk_Order_fkey` FOREIGN KEY (`fk_Order`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderIronServiceDetail` ADD CONSTRAINT `OrderIronServiceDetail_fk_Service_fkey` FOREIGN KEY (`fk_Service`) REFERENCES `Service`(`id_service`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idPayment_fkey` FOREIGN KEY (`fk_idPayment`) REFERENCES `Payment`(`id_payment`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_userCashier_fkey` FOREIGN KEY (`fk_userCashier`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `Order`(`id_order`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashCut` ADD CONSTRAINT `CashCut_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CashWhithdrawal` ADD CONSTRAINT `CashWhithdrawal_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CashWhithdrawal` ADD CONSTRAINT `CashWhithdrawal_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
