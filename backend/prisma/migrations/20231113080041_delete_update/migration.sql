-- DropForeignKey
ALTER TABLE `CashCut` DROP FOREIGN KEY `CashCut_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `CashWhithdrawal` DROP FOREIGN KEY `CashWhithdrawal_fk_cashCut_fkey`;

-- DropForeignKey
ALTER TABLE `CashWhithdrawal` DROP FOREIGN KEY `CashWhithdrawal_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `DeliveryDetail` DROP FOREIGN KEY `DeliveryDetail_fk_idPayment_fkey`;

-- DropForeignKey
ALTER TABLE `DeliveryDetail` DROP FOREIGN KEY `DeliveryDetail_fk_userCashier_fkey`;

-- DropForeignKey
ALTER TABLE `DryService` DROP FOREIGN KEY `DryService_fk_idService_fkey`;

-- DropForeignKey
ALTER TABLE `IronQueue` DROP FOREIGN KEY `IronQueue_fk_idIronService_fkey`;

-- DropForeignKey
ALTER TABLE `IronQueue` DROP FOREIGN KEY `IronQueue_fk_idIronStation_fkey`;

-- DropForeignKey
ALTER TABLE `IronQueue` DROP FOREIGN KEY `IronQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `IronQueue` DROP FOREIGN KEY `IronQueue_fk_idStaffMember_fkey`;

-- DropForeignKey
ALTER TABLE `IronService` DROP FOREIGN KEY `IronService_fk_idService_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idDryService_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryDryQueue` DROP FOREIGN KEY `LaundryDryQueue_fk_idStaffMember_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `LaundryWashQueue` DROP FOREIGN KEY `LaundryWashQueue_fk_idWashService_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_cashCut_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_fk_idOrder_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idDryService_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceDryQueue` DROP FOREIGN KEY `SelfServiceDryQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idMachine_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `SelfServiceWashQueue` DROP FOREIGN KEY `SelfServiceWashQueue_fk_idWashService_fkey`;

-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrder` DROP FOREIGN KEY `ServiceOrder_fk_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrder` DROP FOREIGN KEY `ServiceOrder_fk_client_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrder` DROP FOREIGN KEY `ServiceOrder_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_ServiceOrder_fkey`;

-- DropForeignKey
ALTER TABLE `ServiceOrderDetail` DROP FOREIGN KEY `ServiceOrderDetail_fk_Service_fkey`;

-- DropForeignKey
ALTER TABLE `WashService` DROP FOREIGN KEY `WashService_fk_idService_fkey`;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WashService` ADD CONSTRAINT `WashService_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DryService` ADD CONSTRAINT `DryService_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronService` ADD CONSTRAINT `IronService_fk_idService_fkey` FOREIGN KEY (`fk_idService`) REFERENCES `Service`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_fk_categoryId_fkey` FOREIGN KEY (`fk_categoryId`) REFERENCES `Category`(`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_fk_client_fkey` FOREIGN KEY (`fk_client`) REFERENCES `Client`(`id_client`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrder` ADD CONSTRAINT `ServiceOrder_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_ServiceOrder_fkey` FOREIGN KEY (`fk_ServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceOrderDetail` ADD CONSTRAINT `ServiceOrderDetail_fk_Service_fkey` FOREIGN KEY (`fk_Service`) REFERENCES `Service`(`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryWashQueue` ADD CONSTRAINT `LaundryWashQueue_fk_idWashService_fkey` FOREIGN KEY (`fk_idWashService`) REFERENCES `WashService`(`id_washService`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceWashQueue` ADD CONSTRAINT `SelfServiceWashQueue_fk_idWashService_fkey` FOREIGN KEY (`fk_idWashService`) REFERENCES `WashService`(`id_washService`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaundryDryQueue` ADD CONSTRAINT `LaundryDryQueue_fk_idDryService_fkey` FOREIGN KEY (`fk_idDryService`) REFERENCES `DryService`(`id_dryService`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idMachine_fkey` FOREIGN KEY (`fk_idMachine`) REFERENCES `Machine`(`id_machine`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfServiceDryQueue` ADD CONSTRAINT `SelfServiceDryQueue_fk_idDryService_fkey` FOREIGN KEY (`fk_idDryService`) REFERENCES `DryService`(`id_dryService`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idIronStation_fkey` FOREIGN KEY (`fk_idIronStation`) REFERENCES `IronStation`(`id_ironStation`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idServiceOrder_fkey` FOREIGN KEY (`fk_idServiceOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idStaffMember_fkey` FOREIGN KEY (`fk_idStaffMember`) REFERENCES `StaffMember`(`id_staffMember`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IronQueue` ADD CONSTRAINT `IronQueue_fk_idIronService_fkey` FOREIGN KEY (`fk_idIronService`) REFERENCES `IronService`(`id_ironService`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_fk_idOrder_fkey` FOREIGN KEY (`fk_idOrder`) REFERENCES `ServiceOrder`(`id_order`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_idPayment_fkey` FOREIGN KEY (`fk_idPayment`) REFERENCES `Payment`(`id_payment`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DeliveryDetail` ADD CONSTRAINT `DeliveryDetail_fk_userCashier_fkey` FOREIGN KEY (`fk_userCashier`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashCut` ADD CONSTRAINT `CashCut_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashWhithdrawal` ADD CONSTRAINT `CashWhithdrawal_fk_cashCut_fkey` FOREIGN KEY (`fk_cashCut`) REFERENCES `CashCut`(`id_cashCut`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashWhithdrawal` ADD CONSTRAINT `CashWhithdrawal_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
