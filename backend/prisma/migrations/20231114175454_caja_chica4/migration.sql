/*
  Warnings:

  - You are about to drop the column `cuase` on the `PettyCash` table. All the data in the column will be lost.
  - Added the required column `cause` to the `PettyCash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PettyCash` DROP COLUMN `cuase`,
    ADD COLUMN `cause` VARCHAR(191) NOT NULL,
    ADD COLUMN `fk_user` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `PettyCash` ADD CONSTRAINT `PettyCash_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;
