/*
  Warnings:

  - You are about to drop the column `serviceOrder` on the `CashWithdrawal` table. All the data in the column will be lost.
  - The values [refound,service_cancelled] on the enum `CashWithdrawal_cashWithdrawalType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `CashWithdrawal` DROP COLUMN `serviceOrder`,
    MODIFY `cashWithdrawalType` ENUM('withdrawal', 'supply_cancelled') NOT NULL DEFAULT 'withdrawal';

-- CreateTable
CREATE TABLE `Refound` (
    `id_refound` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_cashCut` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `cashWithdrawalType` ENUM('refound', 'service_cancelled') NOT NULL DEFAULT 'service_cancelled',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `serviceOrder` INTEGER NOT NULL,
    `date` DATE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_refound`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Refound` ADD CONSTRAINT `Refound_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refound` ADD CONSTRAINT `Refound_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
