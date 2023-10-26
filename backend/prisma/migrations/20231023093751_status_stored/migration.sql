-- AlterTable
ALTER TABLE `Order` MODIFY `orderStatus` ENUM('pending', 'inProgress', 'finished', 'delivered', 'stored') NOT NULL DEFAULT 'pending';
