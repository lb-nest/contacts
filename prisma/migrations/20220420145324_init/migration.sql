-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('Opened', 'Closed');

-- CreateEnum
CREATE TYPE "HistoryEventType" AS ENUM ('Created', 'Accepted', 'Returned', 'Closed', 'Reopened', 'Transferred', 'UsernameChanged', 'NameChanged', 'NotesChanged', 'TagsChanged');

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "notes" TEXT NOT NULL DEFAULT E'',
    "status" "ContactStatus" NOT NULL,
    "assignedTo" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "contactId" INTEGER NOT NULL,
    "eventType" "HistoryEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT E'',
    "color" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactTag" (
    "tagId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_projectId_id_key" ON "Contact"("projectId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_projectId_id_key" ON "Tag"("projectId", "id");

-- CreateIndex
CREATE INDEX "ContactTag_tagId_idx" ON "ContactTag"("tagId");

-- CreateIndex
CREATE INDEX "ContactTag_contactId_idx" ON "ContactTag"("contactId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactTag_tagId_contactId_key" ON "ContactTag"("tagId", "contactId");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
