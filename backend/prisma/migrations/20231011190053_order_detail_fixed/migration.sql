/*
  Warnings:

  - You are about to drop the column `deliveryDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryTime` on the `Order` table. All the data in the column will be lost.
  - Added the required column `scheduledDeliveryDate` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `deliveryDate`,
    DROP COLUMN `deliveryTime`,
    ADD COLUMN `scheduledDeliveryDate` DATE NOT NULL,
    ADD COLUMN `scheduledDeliveryTime` TIME NULL;
