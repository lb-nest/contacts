/*
  Warnings:

  - A unique constraint covering the columns `[projectId,id]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `chatId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Tag_projectId_id_key` ON `Tag`(`projectId`, `id`);
