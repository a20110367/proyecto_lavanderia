-- AlterTable
ALTER TABLE `IronQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `LaundryQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `SelfServiceQueue` MODIFY `serviceStatus` ENUM('pending', 'inProgress', 'inProgressWash', 'inProgressDry', 'finished') NOT NULL DEFAULT 'pending';
