-- AlterTable
ALTER TABLE `ServiceOrder` ADD COLUMN `drycleanPieces` INTEGER NULL;

-- AlterTable
ALTER TABLE `ServiceOrderDetail` ADD COLUMN `fk_drycleanService` INTEGER NULL;

-- CreateTable
CREATE TABLE `DrycleanService` (
    `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `pieces` INTEGER NOT NULL,
    `token_id` INTEGER NULL,
    `category_id` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DrycleanService_description_key`(`description`),
    PRIMARY KEY (`id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrycleanQueue` (
    `id_drycleanEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `id_description` VARCHAR(191) NULL,
    `fk_idDrycleanService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idStaffMemberDelivery` INTEGER NULL,
    `token_id` INTEGER NULL,
    `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished') NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id_drycleanEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DrycleanService` ADD CONSTRAINT `DrycleanService_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_drycleanService_fkey` FOREIGN KEY (`fk_drycleanService`) REFERENCES `DrycleanService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrycleanQueue` ADD CONSTRAINT `DrycleanQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrycleanQueue` ADD CONSTRAINT `DrycleanQueue_fk_idStaffMemberDelivery_fkey` FOREIGN KEY (`fk_idStaffMemberDelivery`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DrycleanQueue` ADD CONSTRAINT `DrycleanQueue_fk_idDrycleanService_fkey` FOREIGN KEY (`fk_idDrycleanService`) REFERENCES `DrycleanService`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;
