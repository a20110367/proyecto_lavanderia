-- AlterTable
ALTER TABLE `CashCut` ADD COLUMN `ironPiecesDone` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `ServiceOrderDetail` ADD COLUMN `payMethod` ENUM('cash', 'credit') NOT NULL DEFAULT 'cash';
