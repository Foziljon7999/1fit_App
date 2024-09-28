/*
  Warnings:

  - The primary key for the `GymSports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `GymSports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GymSports" DROP CONSTRAINT "GymSports_pkey",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "GymSports_pkey" PRIMARY KEY ("userId", "gymId", "sportId");

-- AddForeignKey
ALTER TABLE "GymSports" ADD CONSTRAINT "GymSports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
