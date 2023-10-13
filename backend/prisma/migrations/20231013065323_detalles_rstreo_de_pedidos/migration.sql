/*
  Warnings:

  - You are about to drop the column `units` on the `OrderServiceDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP COLUMN `units`;

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `dryCycles` INTEGER NULL,
    ADD COLUMN `washCycles` INTEGER NULL;

-- AlterTable
ALTER TABLE `ServiceTraceDetail` MODIFY `fk_idMachine` INTEGER NULL,
    MODIFY `fk_staffMember` INTEGER NULL;
