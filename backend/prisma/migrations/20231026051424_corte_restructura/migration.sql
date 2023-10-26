/*
  Warnings:

  - You are about to drop the column `subtotal` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal_item1` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal_item2` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal_item3` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal_item4` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal_item5` on the `CashCut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CashCut` DROP COLUMN `subtotal`,
    DROP COLUMN `subtotal_item1`,
    DROP COLUMN `subtotal_item2`,
    DROP COLUMN `subtotal_item3`,
    DROP COLUMN `subtotal_item4`,
    DROP COLUMN `subtotal_item5`,
    ADD COLUMN `ordersPayed` INTEGER NULL,
    ADD COLUMN `toalAutoservicio` DOUBLE NULL,
    ADD COLUMN `totalCash` DOUBLE NULL,
    ADD COLUMN `totalCashWithdrawal` DOUBLE NULL,
    ADD COLUMN `totalCredit` DOUBLE NULL,
    ADD COLUMN `totalEncargo` DOUBLE NULL,
    ADD COLUMN `totalOtros` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `totalPlanchado` DOUBLE NULL,
    MODIFY `inicialCash` DOUBLE NULL DEFAULT 0;
