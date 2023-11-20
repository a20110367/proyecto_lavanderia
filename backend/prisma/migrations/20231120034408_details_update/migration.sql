-- AlterTable
ALTER TABLE `IronQueue` ADD COLUMN `id_description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LaundryQueue` MODIFY `id_description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SelfServiceQueue` MODIFY `id_description` VARCHAR(191) NULL;
