/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `point` ADD COLUMN `slug` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Point_slug_key` ON `point`(`slug`);
