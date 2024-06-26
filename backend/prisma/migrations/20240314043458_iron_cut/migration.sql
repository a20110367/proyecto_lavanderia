-- AlterTable
ALTER TABLE `IronControl` ADD COLUMN `piecesExpress` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `IronQueue` ADD COLUMN `accounted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `IronCut` (
    `id_ironCut` INTEGER NOT NULL AUTO_INCREMENT,
    `startingDay` DATE NULL,
    `endDay` DATE NULL,
    `station1R` INTEGER NOT NULL DEFAULT 0,
    `station1E` INTEGER NOT NULL DEFAULT 0,
    `station2R` INTEGER NOT NULL DEFAULT 0,
    `station2E` INTEGER NOT NULL DEFAULT 0,
    `station3R` INTEGER NOT NULL DEFAULT 0,
    `station3E` INTEGER NOT NULL DEFAULT 0,
    `station4R` INTEGER NOT NULL DEFAULT 0,
    `station4E` INTEGER NOT NULL DEFAULT 0,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_ironCut`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
