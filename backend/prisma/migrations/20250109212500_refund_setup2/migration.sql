/*
  Warnings:

  - You are about to drop the `Refound` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Refound` DROP FOREIGN KEY `Refound_fk_cashCut_fkey`;

-- DropForeignKey
ALTER TABLE `Refound` DROP FOREIGN KEY `Refound_fk_user_fkey`;

-- DropTable
DROP TABLE `Refound`;

-- CreateTable
CREATE TABLE `Refund` (
    `id_refund` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_cashCut` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `refundType` ENUM('refund', 'service_cancelled') NOT NULL DEFAULT 'service_cancelled',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `serviceOrder` INTEGER NOT NULL,
    `date` DATE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_refund`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
