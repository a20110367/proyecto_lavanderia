-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_category_id_fkey`;

-- AlterTable
ALTER TABLE `Service` ALTER COLUMN `category_id` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;
