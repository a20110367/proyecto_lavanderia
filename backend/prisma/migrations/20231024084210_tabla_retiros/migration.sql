-- AlterTable
ALTER TABLE `CashCut` ADD COLUMN `inicialCash` DOUBLE NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `CashWhithdrawal` (
    `id_cashWhihdrawal` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_cashCut` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `cashWhithdrawalType` ENUM('withdrawal', 'refound') NOT NULL DEFAULT 'withdrawal',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `date` DATE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_cashWhihdrawal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CashWhithdrawal` ADD CONSTRAINT `CashWhithdrawal_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CashWhithdrawal` ADD CONSTRAINT `CashWhithdrawal_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE NO ACTION ON UPDATE NO ACTION;
