-- DropForeignKey
ALTER TABLE `DeliveryDetail` DROP FOREIGN KEY `DeliveryDetail_fk_idOrder_fkey`;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;
