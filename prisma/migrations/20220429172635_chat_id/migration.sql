/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contact_chatId_key" ON "Contact"("chatId");
