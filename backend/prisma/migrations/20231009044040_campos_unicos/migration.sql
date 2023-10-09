/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Client` MODIFY `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Client_username_key` ON `Client`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Client_phone_key` ON `Client`(`phone`);
