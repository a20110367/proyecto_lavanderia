-- CreateTable
CREATE TABLE `CancelledServiceOrder` (
    `id_cancelledOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `CancellationTypes` ENUM('cancellation', 'refund') NOT NULL DEFAULT 'cancellation',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CancelledServiceOrder_fk_idServiceOrder_key`(`fk_idServiceOrder`),
    UNIQUE INDEX `CancelledServiceOrder_fk_user_key`(`fk_user`),
    PRIMARY KEY (`id_cancelledOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CancelledServiceOrderDetail` (
    `id_cancelledServiceOrderDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `units` INTEGER NOT NULL DEFAULT 1,
    `subtotal` DOUBLE NOT NULL DEFAULT 0.00,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_serviceOrder` INTEGER NOT NULL,
    `fk_laundryService` INTEGER NULL,
    `fk_selfService` INTEGER NULL,
    `fk_ironService` INTEGER NULL,
    `fk_drycleanService` INTEGER NULL,
    `fk_otherService` INTEGER NULL,

    PRIMARY KEY (`id_cancelledServiceOrderDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CancelledSupplyOrder` (
    `id_cancelledSupplyOrder` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_idSupplyOrder` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,
    `CancellationTypes` ENUM('cancellation', 'refund') NOT NULL DEFAULT 'cancellation',
    `amount` DOUBLE NOT NULL,
    `cause` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CancelledSupplyOrder_fk_idSupplyOrder_key`(`fk_idSupplyOrder`),
    UNIQUE INDEX `CancelledSupplyOrder_fk_user_key`(`fk_user`),
    PRIMARY KEY (`id_cancelledSupplyOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CancelledSupplyOrderDetail` (
    `id_cancelledSupplyOrderDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `units` INTEGER NOT NULL DEFAULT 1,
    `subtotal` DOUBLE NOT NULL DEFAULT 0.00,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `fk_supplyOrder` INTEGER NOT NULL,
    `fk_supplyId` INTEGER NOT NULL,

    PRIMARY KEY (`id_cancelledSupplyOrderDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrder` ADD CONSTRAINT `CancelledServiceOrder_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrder` ADD CONSTRAINT `CancelledServiceOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrderDetail` ADD CONSTRAINT `CancelledServiceOrderDetail_fk_serviceOrder_fkey` FOREIGN KEY (`fk_serviceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrderDetail` ADD CONSTRAINT `CancelledServiceOrderDetail_fk_laundryService_fkey` FOREIGN KEY (`fk_laundryService`) REFERENCES `LaundryService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrderDetail` ADD CONSTRAINT `CancelledServiceOrderDetail_fk_selfService_fkey` FOREIGN KEY (`fk_selfService`) REFERENCES `SelfService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrderDetail` ADD CONSTRAINT `CancelledServiceOrderDetail_fk_ironService_fkey` FOREIGN KEY (`fk_ironService`) REFERENCES `IronService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrderDetail` ADD CONSTRAINT `CancelledServiceOrderDetail_fk_drycleanService_fkey` FOREIGN KEY (`fk_drycleanService`) REFERENCES `DrycleanService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledServiceOrderDetail` ADD CONSTRAINT `CancelledServiceOrderDetail_fk_otherService_fkey` FOREIGN KEY (`fk_otherService`) REFERENCES `OtherService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledSupplyOrder` ADD CONSTRAINT `CancelledSupplyOrder_fk_idSupplyOrder_fkey` FOREIGN KEY (`fk_idSupplyOrder`) REFERENCES `SupplyOrder`(`id_supplyOrder`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledSupplyOrder` ADD CONSTRAINT `CancelledSupplyOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledSupplyOrderDetail` ADD CONSTRAINT `CancelledSupplyOrderDetail_fk_supplyOrder_fkey` FOREIGN KEY (`fk_supplyOrder`) REFERENCES `SupplyOrder`(`id_supplyOrder`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CancelledSupplyOrderDetail` ADD CONSTRAINT `CancelledSupplyOrderDetail_fk_supplyId_fkey` FOREIGN KEY (`fk_supplyId`) REFERENCES `Supply`(`id_supply`) ON DELETE CASCADE ON UPDATE CASCADE;
