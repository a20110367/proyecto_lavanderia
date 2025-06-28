/*
  Warnings:

  - You are about to drop the column `total` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalCash` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalCredit` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalIncome` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `SupplyCashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalCash` on the `SupplyCashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalCredit` on the `SupplyCashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalIncome` on the `SupplyCashCut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CashCut` DROP COLUMN `total`,
    DROP COLUMN `totalCash`,
    DROP COLUMN `totalCredit`,
    DROP COLUMN `totalIncome`,
    ADD COLUMN `totalServiceBalance` DOUBLE NULL,
    ADD COLUMN `totalServiceCash` DOUBLE NULL,
    ADD COLUMN `totalServiceCredit` DOUBLE NULL,
    ADD COLUMN `totalServiceIncome` DOUBLE NULL;

-- AlterTable
ALTER TABLE `SupplyCashCut` DROP COLUMN `total`,
    DROP COLUMN `totalCash`,
    DROP COLUMN `totalCredit`,
    DROP COLUMN `totalIncome`,
    ADD COLUMN `totalSuppliesCash` DOUBLE NULL,
    ADD COLUMN `totalSuppliesCredit` DOUBLE NULL,
    ADD COLUMN `totalSuppliesIncome` DOUBLE NULL;
