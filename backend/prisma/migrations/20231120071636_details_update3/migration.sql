/*
  Warnings:

  - You are about to drop the column `fk_idDryStaffMember` on the `DryDetail` table. All the data in the column will be lost.
  - You are about to drop the column `fk_idWashStaffMember` on the `WashDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `DryDetail` DROP COLUMN `fk_idDryStaffMember`;

-- AlterTable
ALTER TABLE `WashDetail` DROP COLUMN `fk_idWashStaffMember`;
