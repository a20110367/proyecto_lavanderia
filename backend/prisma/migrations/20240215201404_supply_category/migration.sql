/*
  Warnings:

  - Added the required column `category` to the `Supply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Supply` ADD COLUMN `category` ENUM('jabon', 'suavitel', 'pinol', 'desengrasante', 'cloro', 'sanitisante', 'bolsa', 'reforzado', 'ganchos', 'wc', 'otros') NOT NULL;
