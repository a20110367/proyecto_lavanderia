/*
  Warnings:

  - The primary key for the `ServiceTraceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fk_idOrder` on the `ServiceTraceDetail` table. All the data in the column will be lost.
  - Added the required column `fk_idOrderServiceDetail` to the `ServiceTraceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_ServiceTraceDetail` to the `ServiceTraceDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ServiceTraceDetail` DROP FOREIGN KEY `ServiceTraceDetail_fk_idOrder_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` ADD COLUMN `finished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `ServiceTraceDetail` DROP PRIMARY KEY,
    DROP COLUMN `fk_idOrder`,
    ADD COLUMN `finished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `fk_idOrderServiceDetail` INTEGER NOT NULL,
    ADD COLUMN `id_ServiceTraceDetail` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_ServiceTraceDetail`);

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idOrderServiceDetail_fkey` FOREIGN KEY (`fk_idOrderServiceDetail`) REFERENCES `OrderServiceDetail`(`id_OrderServiceDetail`) ON DELETE NO ACTION ON UPDATE NO ACTION;
