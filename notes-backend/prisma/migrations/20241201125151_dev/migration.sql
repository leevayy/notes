-- CreateTable
CREATE TABLE "Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "ListId" INTEGER NOT NULL,
    CONSTRAINT "Card_id_fkey" FOREIGN KEY ("id") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "List" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "BoardId" INTEGER NOT NULL,
    CONSTRAINT "List_id_fkey" FOREIGN KEY ("id") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "Userid" INTEGER NOT NULL,
    CONSTRAINT "Board_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_position_key" ON "Card"("position");

-- CreateIndex
CREATE UNIQUE INDEX "List_position_key" ON "List"("position");
