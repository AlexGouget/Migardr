-- AlterTable
ALTER TABLE `point` ADD COLUMN `ApproximateYearAfter` INTEGER NULL,
    ADD COLUMN `ApproximateYearBefore` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `urlimage` RENAME INDEX `urlimage_pointId_fkey` TO `UrlImage_pointId_fkey`;
