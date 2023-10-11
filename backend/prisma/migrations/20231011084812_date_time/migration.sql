/*
  Warnings:

  - You are about to drop the column `cashCutDate` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `cashCutTime` on the `CashCut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CashCut` DROP COLUMN `cashCutDate`,
    DROP COLUMN `cashCutTime`,
    ADD COLUMN `cashCutD` DATE NULL,
    ADD COLUMN `cashCutT` TIME(0) NULL;
