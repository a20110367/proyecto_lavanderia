/*
  Warnings:

  - The primary key for the `OrderServiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_OrderServiceDetail` on the `OrderServiceDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idOrderServiceDetail` on the `ServiceTraceDetail` table. All the data in the column will be lost.
  - Added the required column `units` to the `OrderServiceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fk_idOrder` to the `ServiceTraceDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ServiceTraceDetail` DROP FOREIGN KEY `ServiceTraceDetail_fk_idOrderServiceDetail_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` DROP PRIMARY KEY,
    DROP COLUMN `id_OrderServiceDetail`,
    ADD COLUMN `units` INTEGER NOT NULL,
    ADD PRIMARY KEY (`fk_idOrder`, `fk_idService`);

-- AlterTable
ALTER TABLE `ServiceTraceDetail` DROP COLUMN `fk_idOrderServiceDetail`,
    ADD COLUMN `fk_idOrder` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ServiceTraceDetail` ADD CONSTRAINT `ServiceTraceDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `OrderServiceDetail`(`fk_idOrder`) ON DELETE NO ACTION ON UPDATE NO ACTION;
