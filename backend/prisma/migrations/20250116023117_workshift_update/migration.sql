/*
  Warnings:

  - You are about to drop the column `totalncome` on the `WorkshiftBalance` table. All the data in the column will be lost.
  - Added the required column `totalIncome` to the `WorkshiftBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `WorkshiftBalance` DROP COLUMN `totalncome`,
    ADD COLUMN `totalIncome` DOUBLE NOT NULL;
