/*
  Warnings:

  - The `year` column on the `point` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ApproximateYearAfter` column on the `point` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ApproximateYearBefore` column on the `point` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `point` DROP COLUMN `year`,
    ADD COLUMN `year` DATETIME(3) NULL,
    DROP COLUMN `ApproximateYearAfter`,
    ADD COLUMN `ApproximateYearAfter` DATETIME(3) NULL,
    DROP COLUMN `ApproximateYearBefore`,
    ADD COLUMN `ApproximateYearBefore` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `typepoint` MODIFY `icon` VARCHAR(191) NULL DEFAULT 'Other.svg',
    MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
