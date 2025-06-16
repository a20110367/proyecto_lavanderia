-- AlterTable
ALTER TABLE `LaundryQueue` ADD COLUMN `combinedDry` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `combinedWash` BOOLEAN NOT NULL DEFAULT false;
