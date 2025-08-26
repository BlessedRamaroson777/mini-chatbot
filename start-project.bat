@echo off
echo Lancement du backend Node.js...
cd backend
start cmd /k "npm install && node server.js"
cd ..

echo Lancement du frontend (Vite)...
cd frontend
start cmd /k "npm install && npm run dev"
cd ..

echo Projet lance !
pause
