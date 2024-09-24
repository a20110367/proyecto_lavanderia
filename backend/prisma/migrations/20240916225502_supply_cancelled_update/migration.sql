/*
  Warnings:

  - You are about to drop the column `id_payment` on the `SupplyOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CancelledSupplyOrder` MODIFY `CancellationTypes` ENUM('cancellation', 'refund') NOT NULL DEFAULT 'refund';

-- AlterTable
ALTER TABLE `CashWithdrawal` ADD COLUMN `supplyOrder` INTEGER NULL,
    MODIFY `cashWithdrawalType` ENUM('withdrawal', 'refound', 'service_cancelled', 'supply_cancelled') NOT NULL DEFAULT 'withdrawal';

-- AlterTable
ALTER TABLE `SupplyOrder` DROP COLUMN `id_payment`,
    ADD COLUMN `supplyOrderStatus` ENUM('active', 'stored', 'cancelled') NOT NULL DEFAULT 'active',
    MODIFY `payForm` ENUM('advance', 'delivery') NOT NULL DEFAULT 'advance',
    MODIFY `payStatus` ENUM('paid', 'unpaid') NOT NULL DEFAULT 'paid';
