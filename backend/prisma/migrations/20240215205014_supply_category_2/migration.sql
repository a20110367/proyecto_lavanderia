/*
  Warnings:

  - The values [sanitisante] on the enum `Supply_category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Supply` MODIFY `category` ENUM('jabon', 'suavitel', 'pinol', 'desengrasante', 'cloro', 'sanitizante', 'bolsa', 'reforzado', 'ganchos', 'wc', 'otros') NOT NULL;
