-- DropForeignKey
ALTER TABLE `OrderServiceDetail` DROP FOREIGN KEY `OrderServiceDetail_fk_Order_fkey`;

-- DropForeignKey
ALTER TABLE `OrderServiceDetail` DROP FOREIGN KEY `OrderServiceDetail_fk_Service_fkey`;

-- AddForeignKey
ALTER TABLE `OrderServiceDetail` ADD CONSTRAINT `OrderServiceDetail_fk_Order_fkey` FOREIGN KEY (`fk_Order`) REFERENCES `Order`(`id_order`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderServiceDetail` ADD CONSTRAINT `OrderServiceDetail_fk_Service_fkey` FOREIGN KEY (`fk_Service`) REFERENCES `Service`(`id_service`) ON DELETE NO ACTION ON UPDATE CASCADE;
