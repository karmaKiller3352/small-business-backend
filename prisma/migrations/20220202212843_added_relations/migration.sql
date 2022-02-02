-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('eng', 'ru');

-- CreateEnum
CREATE TYPE "Themes" AS ENUM ('light', 'dark');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('None', 'Telegram', 'Whatsup', 'Viber', 'Email');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "companyId" INTEGER;

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "additionalInfo" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "userId" INTEGER NOT NULL,
    "language" "Languages" NOT NULL DEFAULT E'ru',
    "theme" "Themes" NOT NULL DEFAULT E'light'
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,
    "companyName" TEXT,
    "address" TEXT,
    "subscriptionAddress" TEXT,
    "subscriptionType" "SubscriptionType" NOT NULL DEFAULT E'None',
    "companyId" INTEGER,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_createdBy_key" ON "Client"("createdBy");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
