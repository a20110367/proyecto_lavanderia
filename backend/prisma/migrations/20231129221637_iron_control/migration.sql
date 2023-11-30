-- AlterTable
ALTER TABLE `IronStation` ADD COLUMN `description` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ironControl` (
    `id_ironControl` INTEGER NOT NULL AUTO_INCREMENT,
    `piecesCashcut` INTEGER NOT NULL DEFAULT 0,
    `piecesToday` INTEGER NOT NULL DEFAULT 0,
    `piecesLeft` INTEGER NOT NULL DEFAULT 0,
    `piecesTomorrow` INTEGER NOT NULL DEFAULT 0,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_ironControl`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
