-- AlterTable
ALTER TABLE `DrycleanQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `IronQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `LaundryQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `OtherQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished', 'cancelled') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `SelfServiceQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished', 'cancelled') NOT NULL DEFAULT 'pending';
