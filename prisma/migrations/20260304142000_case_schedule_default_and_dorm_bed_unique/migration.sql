/*
  Warnings:

  - A unique constraint covering the columns `[roomId,year,semester,bedPosition]` on the table `dorm_users` will be added. If there are existing duplicate values, this will fail.

*/

-- AlterTable
ALTER TABLE `case_schedules`
    MODIFY `isOpen` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `dorm_users_roomId_year_semester_bedPosition_key`
    ON `dorm_users`(`roomId`, `year`, `semester`, `bedPosition`);
