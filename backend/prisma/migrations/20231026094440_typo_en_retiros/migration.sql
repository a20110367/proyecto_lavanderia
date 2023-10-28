/*
  Warnings:

  - The primary key for the `CashWhithdrawal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_cashWhihdrawal` on the `CashWhithdrawal` table. All the data in the column will be lost.
  - Added the required column `id_cashWhithdrawal` to the `CashWhithdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CashCut` ADD COLUMN `totalIncome` DOUBLE NULL;

-- AlterTable
ALTER TABLE `CashWhithdrawal` DROP PRIMARY KEY,
    DROP COLUMN `id_cashWhihdrawal`,
    ADD COLUMN `id_cashWhithdrawal` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_cashWhithdrawal`);
