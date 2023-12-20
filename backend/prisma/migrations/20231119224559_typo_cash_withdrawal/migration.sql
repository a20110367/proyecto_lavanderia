/*
  Warnings:

  - You are about to drop the `CashWhithdrawal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CashWhithdrawal` DROP FOREIGN KEY `CashWhithdrawal_fk_cashCut_fkey`;

-- DropForeignKey
ALTER TABLE `CashWhithdrawal` DROP FOREIGN KEY `CashWhithdrawal_fk_user_fkey`;

-- DropTable
DROP TABLE `CashWhithdrawal`;

-- CreateTable
CREATE TABLE `CashWithdrawal` (
    `id_cashWithdrawal` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_cashCut` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `cashWithdrawalType` ENUM('withdrawal', 'refound') NOT NULL DEFAULT 'withdrawal',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `serviceOrder` INTEGER NULL,
    `date` DATE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_cashWithdrawal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CashWithdrawal` ADD CONSTRAINT `CashWithdrawal_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashWithdrawal` ADD CONSTRAINT `CashWithdrawal_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
