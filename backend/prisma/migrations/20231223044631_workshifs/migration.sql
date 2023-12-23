-- AlterTable
ALTER TABLE `CashCut` ADD COLUMN `workShift` ENUM('morning', 'evening', 'nigth') NOT NULL DEFAULT 'morning';
