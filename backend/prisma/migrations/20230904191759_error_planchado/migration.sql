/*
  Warnings:

  - You are about to drop the column `tipo` on the `planchado` table. All the data in the column will be lost.
  - Added the required column `piezas` to the `Planchado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `planchado` DROP COLUMN `tipo`,
    ADD COLUMN `piezas` VARCHAR(191) NOT NULL;
