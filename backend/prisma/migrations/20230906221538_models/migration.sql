-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `secondName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `pass` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id_client` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `secondName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `pass` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id_client`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Machine` (
    `id_machine` INTEGER NOT NULL AUTO_INCREMENT,
    `machineType` ENUM('lavadora', 'secadora') NOT NULL DEFAULT 'lavadora',
    `model` VARCHAR(191) NOT NULL,
    `cicleTime` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `status` ENUM('available', 'unavailable') NOT NULL DEFAULT 'available',
    `notes` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_machine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `time` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,

    PRIMARY KEY (`id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id_order` INTEGER NOT NULL AUTO_INCREMENT,
    `units` INTEGER NOT NULL DEFAULT 1,
    `receptionDate` DATETIME NOT NULL,
    `deliveryDate` DATETIME NOT NULL,
    `payMethod` ENUM('tarjeta', 'efectivo') NOT NULL DEFAULT 'efectivo',
    `orderStatus` ENUM('pendiente', 'finalizado') NOT NULL DEFAULT 'pendiente',
    `totalPrice` DOUBLE NOT NULL,
    `fk_client` INTEGER NOT NULL,
    `fk_employee` INTEGER NOT NULL,
    `fk_service` INTEGER NOT NULL,

    PRIMARY KEY (`id_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_employee_fkey` FOREIGN KEY (`fk_employee`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_fk_service_fkey` FOREIGN KEY (`fk_service`) REFERENCES `Service`(`id_service`) ON DELETE RESTRICT ON UPDATE CASCADE;
