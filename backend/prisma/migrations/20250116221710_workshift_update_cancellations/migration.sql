/*
  Warnings:

  - The values [service_cancelled] on the enum `CashWithdrawal_cashWithdrawalType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `cancellations` to the `WorkshiftBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CashWithdrawal` MODIFY `cashWithdrawalType` ENUM('withdrawal', 'supply_cancelled') NOT NULL DEFAULT 'withdrawal';

-- AlterTable
ALTER TABLE `WorkshiftBalance` ADD COLUMN `cancellations` DOUBLE NOT NULL;
