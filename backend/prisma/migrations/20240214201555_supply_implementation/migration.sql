-- CreateTable
CREATE TABLE `SupplyCashCut` (
    `fk_user` INTEGER NOT NULL,
    `total` DOUBLE NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `cashCutD` DATE NULL,
    `cashCutT` TIME(0) NULL,
    `id_supplyCashCut` INTEGER NOT NULL AUTO_INCREMENT,
    `cashCutStatus` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    `initialCash` DOUBLE NULL DEFAULT 0,
    `ordersPayed` INTEGER NULL,
    `totalJabon` DOUBLE NULL,
    `totalSuavitel` DOUBLE NULL,
    `totalPinol` DOUBLE NULL,
    `totalDesegrasante` DOUBLE NULL,
    `totalCloro` DOUBLE NULL,
    `totalSanitisante` DOUBLE NULL,
    `totalBolsa` DOUBLE NULL,
    `totalReforzado` DOUBLE NULL,
    `totalGanchos` DOUBLE NULL,
    `totalWC` DOUBLE NULL,
    `totalOtros` DOUBLE NULL DEFAULT 0,
    `totalIncome` DOUBLE NULL,
    `workShift` ENUM('morning', 'evening', 'nigth') NOT NULL DEFAULT 'morning',

    PRIMARY KEY (`id_supplyCashCut`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplyPayment` (
    `id_payment` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idOrder` INTEGER NOT NULL,
    `payMethod` ENUM('cash', 'credit') NOT NULL,
    `payDate` DATE NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_cashCut` INTEGER NOT NULL,
    `payTime` TIME(0) NOT NULL,
    `payTotal` DOUBLE NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SupplyPayment_fk_idOrder_key`(`fk_idOrder`),
    PRIMARY KEY (`id_payment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplyOrder` (
    `id_supplyOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `receptionDate` DATE NOT NULL,
    `totalPrice` DOUBLE NOT NULL,
    `fk_client` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `numberOfItems` INTEGER NOT NULL DEFAULT 1,
    `payForm` ENUM('advance', 'delivery') NOT NULL DEFAULT 'delivery',
    `payStatus` ENUM('paid', 'unpaid') NOT NULL DEFAULT 'unpaid',
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `id_payment` INTEGER NULL,

    PRIMARY KEY (`id_supplyOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplyOrderDetail` (
    `id_supplyOrderDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `units` INTEGER NOT NULL DEFAULT 1,
    `subtotal` DOUBLE NOT NULL DEFAULT 0.00,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_supplyOrder` INTEGER NOT NULL,
    `fk_supplyId` INTEGER NOT NULL,

    PRIMARY KEY (`id_supplyOrderDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supply` (
    `id_supply` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `unit` ENUM('mililitros', 'gramos', 'piezas') NOT NULL,
    `value` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supply_description_key`(`description`),
    PRIMARY KEY (`id_supply`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SupplyCashCut` ADD CONSTRAINT `SupplyCashCut_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyPayment` ADD CONSTRAINT `SupplyPayment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `SupplyCashCut`(`id_supplyCashCut`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyPayment` ADD CONSTRAINT `SupplyPayment_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `SupplyOrder`(`id_supplyOrder`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyOrder` ADD CONSTRAINT `SupplyOrder_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyOrder` ADD CONSTRAINT `SupplyOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyOrderDetail` ADD CONSTRAINT `SupplyOrderDetail_fk_supplyOrder_fkey` FOREIGN KEY (`fk_supplyOrder`) REFERENCES `SupplyOrder`(`id_supplyOrder`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplyOrderDetail` ADD CONSTRAINT `SupplyOrderDetail_fk_supplyId_fkey` FOREIGN KEY (`fk_supplyId`) REFERENCES `Supply`(`id_supply`) ON DELETE CASCADE ON UPDATE CASCADE;
