/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "access_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "userName" DROP NOT NULL;
