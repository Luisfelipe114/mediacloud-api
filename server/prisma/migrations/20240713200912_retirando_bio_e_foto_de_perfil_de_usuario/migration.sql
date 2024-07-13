/*
  Warnings:

  - You are about to drop the column `bio` on the `UnverifiedUser` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `UnverifiedUser` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UnverifiedUser" DROP COLUMN "bio",
DROP COLUMN "profilePicture";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "bio",
DROP COLUMN "profilePicture";
