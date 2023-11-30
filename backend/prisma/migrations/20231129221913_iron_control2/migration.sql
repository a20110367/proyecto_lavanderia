/*
  Warnings:

  - You are about to drop the `ironControl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ironControl`;

-- CreateTable
CREATE TABLE `IronControl` (
    `id_ironControl` INTEGER NOT NULL AUTO_INCREMENT,
    `piecesCashcut` INTEGER NOT NULL DEFAULT 0,
    `piecesToday` INTEGER NOT NULL DEFAULT 0,
    `piecesLeft` INTEGER NOT NULL DEFAULT 0,
    `piecesTomorrow` INTEGER NOT NULL DEFAULT 0,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_ironControl`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
