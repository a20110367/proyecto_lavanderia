-- CreateTable
CREATE TABLE `PettyCash` (
    `id_movement` INTEGER NOT NULL AUTO_INCREMENT,
    `pettyCashType` ENUM('withdrawal', 'deposit') NOT NULL DEFAULT 'withdrawal',
    `amount` DOUBLE NOT NULL,
    `balance` DOUBLE NOT NULL,
    `cuase` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_movement`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
