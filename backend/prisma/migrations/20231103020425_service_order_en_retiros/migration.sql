/*
  Warnings:

  - A unique constraint covering the columns `[description]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CashWhithdrawal` ADD COLUMN `serviceOrder` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Service_description_key` ON `Service`(`description`);
