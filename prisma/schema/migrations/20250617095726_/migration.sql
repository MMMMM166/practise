/*
  Warnings:

  - You are about to drop the column `player1_id` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `player2_id` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomName]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomName` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user1_id` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_player1_id_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_player2_id_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "player1_id",
DROP COLUMN "player2_id",
ADD COLUMN     "roomName" TEXT NOT NULL,
ADD COLUMN     "user1_id" TEXT NOT NULL,
ADD COLUMN     "user2_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "rooms_roomName_key" ON "rooms"("roomName");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
