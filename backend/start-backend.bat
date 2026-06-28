@echo off
echo ================================================
echo  LA TERRAZA - Backend API
echo ================================================
echo.
echo 1. Asegurate de tener PostgreSQL corriendo
echo 2. Verifica que la BD 'la_terraza_db' exista
echo.
echo Ejecutando migraciones...
call npx prisma migrate deploy
echo.
echo Sembrando datos demo...
call npx prisma db seed
echo.
echo Iniciando servidor en http://localhost:3000
call npm run start:dev
