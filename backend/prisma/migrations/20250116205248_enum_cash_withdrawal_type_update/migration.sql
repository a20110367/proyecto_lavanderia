-- AlterTable
ALTER TABLE `CashWithdrawal` MODIFY `cashWithdrawalType` ENUM('withdrawal', 'supply_cancelled', 'service_cancelled') NOT NULL DEFAULT 'withdrawal';
