/*
  Warnings:

  - Changed the type of `yearDiscovery` on the `point` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `point` DROP COLUMN `yearDiscovery`,
    ADD COLUMN `yearDiscovery` DATETIME(3) NOT NULL;
