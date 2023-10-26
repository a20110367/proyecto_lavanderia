/*
  Warnings:

  - A unique constraint covering the columns `[categoryDescription]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_categoryDescription` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Machine` MODIFY `machineType` ENUM('lavadora', 'secadora', 'plancha') NOT NULL DEFAULT 'lavadora';

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `fk_categoryDescription` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_categoryDescription_key` ON `Category`(`categoryDescription`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_categoryDescription_fkey` FOREIGN KEY (`fk_categoryDescription`) REFERENCES `Category`(`categoryDescription`) ON DELETE RESTRICT ON UPDATE CASCADE;
