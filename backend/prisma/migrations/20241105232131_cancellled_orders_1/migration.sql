-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `cancelled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `ServiceOrderDetail` ADD COLUMN `cancelled` BOOLEAN NOT NULL DEFAULT false;
