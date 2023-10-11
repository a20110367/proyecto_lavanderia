/*
  Warnings:

  - You are about to drop the column `fk_employee` on the `Order` table. All the data in the column will be lost.
  - Added the required column `fk_user` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_fk_employee_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `fk_employee`,
    ADD COLUMN `fk_user` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE CASCADE;
