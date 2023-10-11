/*
  Warnings:

  - The primary key for the `CashCut` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_chashCut` on the `CashCut` table. All the data in the column will be lost.
  - Added the required column `id_cashCut` to the `CashCut` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_cashCut_fkey`;

-- AlterTable
ALTER TABLE `CashCut` DROP PRIMARY KEY,
    DROP COLUMN `id_chashCut`,
    ADD COLUMN `id_cashCut` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_cashCut`);

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;
