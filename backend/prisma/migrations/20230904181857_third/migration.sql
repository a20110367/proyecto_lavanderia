/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_user`);

-- CreateTable
CREATE TABLE `Client` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `apellido_p` VARCHAR(191) NOT NULL,
    `apellido_m` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lavado` (
    `id_lavado` INTEGER NOT NULL AUTO_INCREMENT,
    `precio` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_lavado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Planchado` (
    `id_planchado` INTEGER NOT NULL AUTO_INCREMENT,
    `precio` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_planchado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Servicio` (
    `id_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_user` INTEGER NOT NULL,
    `fk_client` INTEGER NOT NULL,
    `fk_lavado` INTEGER NOT NULL,
    `fk_planchado` INTEGER NOT NULL,

    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `id_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `f_recepcion` DATETIME(3) NOT NULL,
    `f_entrega` DATETIME(3) NOT NULL,
    `forma_pago` VARCHAR(191) NOT NULL,
    `tipo_pago` VARCHAR(191) NOT NULL,
    `fk_servicio` INTEGER NOT NULL,

    PRIMARY KEY (`id_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_fk_lavado_fkey` FOREIGN KEY (`fk_lavado`) REFERENCES `Lavado`(`id_lavado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Servicio` ADD CONSTRAINT `Servicio_fk_planchado_fkey` FOREIGN KEY (`fk_planchado`) REFERENCES `Planchado`(`id_planchado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_fk_servicio_fkey` FOREIGN KEY (`fk_servicio`) REFERENCES `Servicio`(`id_servicio`) ON DELETE RESTRICT ON UPDATE CASCADE;
