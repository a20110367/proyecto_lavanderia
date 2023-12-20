/*
  Warnings:

  - Added the required column `movementDate` to the `PettyCash` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PettyCash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PettyCash` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `movementDate` DATE NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
