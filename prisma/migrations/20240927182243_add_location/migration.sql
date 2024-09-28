/*
  Warnings:

  - The primary key for the `GymSports` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GymSports" DROP CONSTRAINT "GymSports_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "GymSports_pkey" PRIMARY KEY ("id");
