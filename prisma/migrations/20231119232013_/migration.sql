/*
  Warnings:

  - Added the required column `filename` to the `urlimage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `urlimage` ADD COLUMN `filename` VARCHAR(191) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `description` VARCHAR(191) NULL;
