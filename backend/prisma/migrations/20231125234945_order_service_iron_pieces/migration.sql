-- AlterTable
ALTER TABLE `ServiceOrder` ADD COLUMN `express` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ironPieces` INTEGER NULL;
