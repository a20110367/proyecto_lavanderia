/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CancelledServiceOrderDetail` ALTER COLUMN `priceCash` DROP DEFAULT,
    ALTER COLUMN `priceCredit` DROP DEFAULT,
    ALTER COLUMN `serviceDescription` DROP DEFAULT;

-- AlterTable
ALTER TABLE `DrycleanService` ALTER COLUMN `priceCredit` DROP DEFAULT;

-- AlterTable
ALTER TABLE `IronService` ALTER COLUMN `priceCredit` DROP DEFAULT;

-- AlterTable
ALTER TABLE `LaundryService` ALTER COLUMN `priceCredit` DROP DEFAULT;

-- AlterTable
ALTER TABLE `OtherService` ALTER COLUMN `priceCredit` DROP DEFAULT;

-- AlterTable
ALTER TABLE `SelfService` ALTER COLUMN `priceCredit` DROP DEFAULT;

-- AlterTable
ALTER TABLE `ServiceOrderDetail` ALTER COLUMN `priceCash` DROP DEFAULT,
    ALTER COLUMN `priceCredit` DROP DEFAULT,
    ALTER COLUMN `serviceDescription` DROP DEFAULT;

-- AlterTable
ALTER TABLE `SupplyOrderDetail` ALTER COLUMN `supplyDescription` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `Client_phone_key` ON `Client`(`phone`);
