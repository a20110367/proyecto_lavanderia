/*
  Warnings:

  - You are about to drop the column `inicialCash` on the `CashCut` table. All the data in the column will be lost.
  - You are about to drop the column `toalAutoservicio` on the `CashCut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CashCut` DROP COLUMN `inicialCash`,
    DROP COLUMN `toalAutoservicio`,
    ADD COLUMN `initialCash` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `totalAutoservicio` DOUBLE NULL;
