/*
  Warnings:

  - Added the required column `content` to the `point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `point` ADD COLUMN `content` TEXT NOT NULL;
