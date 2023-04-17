/*
  Warnings:

  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;
