/*
  Warnings:

  - You are about to drop the column `action` on the `case_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `cases` table. All the data in the column will be lost.
  - Added the required column `isOpen` to the `case_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `case_schedules` DROP COLUMN `action`,
    ADD COLUMN `isOpen` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `cases` DROP COLUMN `status`,
    ADD COLUMN `isConnected` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isOpen` BOOLEAN NOT NULL DEFAULT true;
