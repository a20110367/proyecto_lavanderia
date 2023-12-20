/*
  Warnings:

  - A unique constraint covering the columns `[ipAddress]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Machine` ADD COLUMN `ipAddress` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ServiceOrder` MODIFY `orderStatus` ENUM('pending', 'inProgress', 'finished', 'delivered', 'stored', 'cancelled') NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX `Machine_ipAddress_key` ON `Machine`(`ipAddress`);
