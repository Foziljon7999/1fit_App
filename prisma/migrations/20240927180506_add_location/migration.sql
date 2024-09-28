/*
  Warnings:

  - Added the required column `branch` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Gym` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
