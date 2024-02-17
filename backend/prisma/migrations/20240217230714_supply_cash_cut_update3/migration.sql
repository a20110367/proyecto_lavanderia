/*
  Warnings:

  - You are about to drop the column `totalDesegrasante` on the `SupplyCashCut` table. All the data in the column will be lost.
  - You are about to drop the column `totalSanitisante` on the `SupplyCashCut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SupplyCashCut` DROP COLUMN `totalDesegrasante`,
    DROP COLUMN `totalSanitisante`,
    ADD COLUMN `totalDesengrasante` DOUBLE NULL,
    ADD COLUMN `totalSanitizante` DOUBLE NULL;
