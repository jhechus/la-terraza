-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nombre" TEXT NOT NULL DEFAULT 'La Terraza',
    "slogan" TEXT NOT NULL DEFAULT 'Una experiencia que empieza desde la primera vista',
    "descripcion" TEXT NOT NULL DEFAULT '',
    "logo" TEXT,
    "direccion" TEXT NOT NULL DEFAULT '',
    "telefono" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "correo" TEXT NOT NULL DEFAULT '',
    "horarios" JSONB NOT NULL DEFAULT '{}',
    "redesSociales" JSONB NOT NULL DEFAULT '{}',
    "colorPrimario" TEXT NOT NULL DEFAULT '#1a1a2e',
    "colorSecundario" TEXT NOT NULL DEFAULT '#c9a84c',
    "colorAcento" TEXT NOT NULL DEFAULT '#e94560',
    "metaDescripcion" TEXT NOT NULL DEFAULT '',
    "metaKeywords" TEXT NOT NULL DEFAULT '',
    "ciudad" TEXT NOT NULL DEFAULT '',
    "pais" TEXT NOT NULL DEFAULT '',
    "coordenadas" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "icono" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "imagen" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "categoriaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" SERIAL NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT,
    "fecha" DATE NOT NULL,
    "hora" TEXT NOT NULL,
    "personas" INTEGER NOT NULL,
    "comentarios" TEXT,
    "estado" "ReservationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "notaAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
