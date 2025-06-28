-- AlterTable
ALTER TABLE `CancelledServiceOrderDetail` ADD COLUMN `priceCash` DOUBLE NOT NULL DEFAULT 1.00,
    ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00,
    ADD COLUMN `serviceDescription` VARCHAR(191) NOT NULL DEFAULT 'General';

-- AlterTable
ALTER TABLE `ServiceOrderDetail` ADD COLUMN `priceCash` DOUBLE NOT NULL DEFAULT 1.00,
    ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00,
    ADD COLUMN `serviceDescription` VARCHAR(191) NOT NULL DEFAULT 'General';
