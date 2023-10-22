/*
  Warnings:

  - You are about to drop the column `fk_category` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_fk_category_fkey`;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `fk_category`,
    ADD COLUMN `category_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE NO ACTION ON UPDATE NO ACTION;
