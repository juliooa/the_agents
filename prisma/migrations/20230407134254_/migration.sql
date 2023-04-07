-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "systemMessage" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "imageUrl" TEXT,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "conversationId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
