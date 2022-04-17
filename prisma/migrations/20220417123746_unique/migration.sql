/*
  Warnings:

  - A unique constraint covering the columns `[projectId,id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Contact_projectId_id_key` ON `Contact`(`projectId`, `id`);
