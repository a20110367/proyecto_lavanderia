/*
  Warnings:

  - You are about to drop the column `fk_categoryDescription` on the `Order` table. All the data in the column will be lost.
  - Added the required column `fk_categoryId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_categoryDescription_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_client_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_user_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `fk_categoryDescription`,
    ADD COLUMN `fk_categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_categoryId_fkey` FOREIGN KEY (`fk_categoryId`) REFERENCES `Category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
