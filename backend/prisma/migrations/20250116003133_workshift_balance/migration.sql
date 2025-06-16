-- CreateTable
CREATE TABLE `WorkshiftBalance` (
    `id_workshifBalance` INTEGER NOT NULL AUTO_INCREMENT,
    `id_supplyCashCut` INTEGER NOT NULL,
    `id_cashCut` INTEGER NOT NULL,
    `cashIncome` DOUBLE NOT NULL,
    `creditIncome` DOUBLE NOT NULL,
    `withdrawal` DOUBLE NOT NULL,
    `initialCash` DOUBLE NOT NULL,
    `totalCashBalace` DOUBLE NOT NULL,
    `totalncome` DOUBLE NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_workshifBalance`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
