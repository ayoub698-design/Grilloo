@echo off
rem Ouvre le site catalogue GRILLOO en HTML local (dossier "site-html"), sans serveur.
cd /d "%~dp0"
if not exist "site-html\index.html" (
  echo Le dossier "site-html" est absent : lancez d'abord "npm run html".
  pause
  exit /b 1
)
start "" "%~dp0site-html\index.html"
