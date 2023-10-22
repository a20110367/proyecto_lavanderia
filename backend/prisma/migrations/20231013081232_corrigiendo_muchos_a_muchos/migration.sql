/*
  Warnings:

  - You are about to drop the column `fk_userCashier` on the `Payment` table. All the data in the column will be lost.
  - Made the column `fk_cashCut` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_cashCut_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_userCashier_fkey`;

-- AlterTable
ALTER TABLE `OrderServiceDetail` ALTER COLUMN `fk_idService` DROP DEFAULT,
    ALTER COLUMN `fk_idOrder` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `fk_userCashier`,
    MODIFY `fk_cashCut` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_ClientToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClientToUser_AB_unique`(`A`, `B`),
    INDEX `_ClientToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MachineToStaffMember` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MachineToStaffMember_AB_unique`(`A`, `B`),
    INDEX `_MachineToStaffMember_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OrderToService` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OrderToService_AB_unique`(`A`, `B`),
    INDEX `_OrderToService_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_ClientToUser` ADD CONSTRAINT `_ClientToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Client`(`id_client`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClientToUser` ADD CONSTRAINT `_ClientToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MachineToStaffMember` ADD CONSTRAINT `_MachineToStaffMember_A_fkey` FOREIGN KEY (`A`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MachineToStaffMember` ADD CONSTRAINT `_MachineToStaffMember_B_fkey` FOREIGN KEY (`B`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToService` ADD CONSTRAINT `_OrderToService_A_fkey` FOREIGN KEY (`A`) REFERENCES `Order`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToService` ADD CONSTRAINT `_OrderToService_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;
