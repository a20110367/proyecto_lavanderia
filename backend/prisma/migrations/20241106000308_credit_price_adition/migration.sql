-- AlterTable
ALTER TABLE `CashCut` ADD COLUMN `ordersCancelled` INTEGER NULL,
    ADD COLUMN `totalCancelations` DOUBLE NULL;

-- AlterTable
ALTER TABLE `DrycleanService` ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00;

-- AlterTable
ALTER TABLE `IronService` ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00;

-- AlterTable
ALTER TABLE `LaundryService` ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00;

-- AlterTable
ALTER TABLE `OtherService` ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00;

-- AlterTable
ALTER TABLE `SelfService` ADD COLUMN `priceCredit` DOUBLE NOT NULL DEFAULT 1.00;

-- AlterTable
ALTER TABLE `Supply` MODIFY `price` DOUBLE NOT NULL DEFAULT 1.00;
