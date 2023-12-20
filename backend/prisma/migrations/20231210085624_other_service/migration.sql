-- AlterTable
ALTER TABLE `ServiceOrderDetail` ADD COLUMN `fk_otherService` INTEGER NULL;

-- CreateTable
CREATE TABLE `OtherService` (
    `id_service` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `token_id` INTEGER NULL,
    `category_id` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OtherService_description_key`(`description`),
    PRIMARY KEY (`id_service`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtherQueue` (
    `id_otherEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `id_description` VARCHAR(191) NULL,
    `fk_idOtherService` INTEGER NOT NULL,
    `fk_idServiceOrder` INTEGER NOT NULL,
    `fk_idStaffMember` INTEGER NULL,
    `token_id` INTEGER NULL,
    `fk_idMachine` INTEGER NULL,
    `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished') NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id_otherEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OtherService` ADD CONSTRAINT `OtherService_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_otherService_fkey` FOREIGN KEY (`fk_otherService`) REFERENCES `OtherService`(`id_service`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WashDetail` ADD CONSTRAINT `WashDetail_fk_idWashMachine_fkey` FOREIGN KEY (`fk_idWashMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DryDetail` ADD CONSTRAINT `DryDetail_fk_idDryMachine_fkey` FOREIGN KEY (`fk_idDryMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherQueue` ADD CONSTRAINT `OtherQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherQueue` ADD CONSTRAINT `OtherQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherQueue` ADD CONSTRAINT `OtherQueue_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OtherQueue` ADD CONSTRAINT `OtherQueue_fk_idOtherService_fkey` FOREIGN KEY (`fk_idOtherService`) REFERENCES `OtherService`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;
