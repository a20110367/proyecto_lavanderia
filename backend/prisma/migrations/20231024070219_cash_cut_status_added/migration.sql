-- AlterTable
ALTER TABLE `CashCut` ADD COLUMN `cashCutStatus` ENUM('open', 'closed') NOT NULL DEFAULT 'open';
