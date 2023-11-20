/*
  Warnings:

  - A unique constraint covering the columns `[coverImageId]` on the table `point` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `urlimage` DROP FOREIGN KEY `UrlImage_pointId_fkey`;

-- AlterTable
ALTER TABLE `point` ADD COLUMN `coverImageId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `point_coverImageId_key` ON `point`(`coverImageId`);

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `point_coverImageId_fkey` FOREIGN KEY (`coverImageId`) REFERENCES `urlimage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `urlimage` ADD CONSTRAINT `urlimage_pointId_fkey` FOREIGN KEY (`pointId`) REFERENCES `point`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
