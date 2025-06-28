/*
  Warnings:

  - You are about to drop the column `supplyOrder` on the `CashWithdrawal` table. All the data in the column will be lost.
  - You are about to drop the `CancelledSupplyOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CancelledSupplyOrderDetail` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Made the column `serviceOrder` on table `CashWithdrawal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `secondLN` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pieces` on table `IronStation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `CancelledSupplyOrder` DROP FOREIGN KEY `CancelledSupplyOrder_fk_idSupplyOrder_fkey`;

-- DropForeignKey
ALTER TABLE `CancelledSupplyOrder` DROP FOREIGN KEY `CancelledSupplyOrder_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `CancelledSupplyOrderDetail` DROP FOREIGN KEY `CancelledSupplyOrderDetail_fk_supplyId_fkey`;

-- DropForeignKey
ALTER TABLE `CancelledSupplyOrderDetail` DROP FOREIGN KEY `CancelledSupplyOrderDetail_fk_supplyOrder_fkey`;

-- AlterTable
ALTER TABLE `CashWithdrawal` DROP COLUMN `supplyOrder`,
    MODIFY `serviceOrder` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Client` MODIFY `secondLN` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `IronService` MODIFY `cycleTime` INTEGER NULL;

-- AlterTable
ALTER TABLE `IronStation` MODIFY `pieces` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `LaundryService` MODIFY `washCycleTime` INTEGER NULL,
    MODIFY `dryCycleTime` INTEGER NULL;

-- AlterTable
ALTER TABLE `SelfService` MODIFY `cycleTime` INTEGER NULL;

-- AlterTable
ALTER TABLE `SupplyOrder` ALTER COLUMN `numberOfItems` DROP DEFAULT,
    ALTER COLUMN `payForm` DROP DEFAULT,
    ALTER COLUMN `payStatus` DROP DEFAULT;

-- AlterTable
ALTER TABLE `SupplyOrderDetail` ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0.00;

-- DropTable
DROP TABLE `CancelledSupplyOrder`;

-- DropTable
DROP TABLE `CancelledSupplyOrderDetail`;

-- CreateIndex
CREATE UNIQUE INDEX `Client_phone_key` ON `Client`(`phone`);
