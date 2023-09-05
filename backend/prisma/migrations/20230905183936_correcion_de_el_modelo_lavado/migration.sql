/*
  Warnings:

  - Added the required column `estatus` to the `Lavado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelo` to the `Lavado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notas` to the `Lavado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiempo_ciclo` to the `Lavado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lavado` ADD COLUMN `estatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `modelo` VARCHAR(191) NOT NULL,
    ADD COLUMN `notas` VARCHAR(191) NOT NULL,
    ADD COLUMN `tiempo_ciclo` INTEGER NOT NULL;
