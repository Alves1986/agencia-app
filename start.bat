@echo off
echo ============================================
echo   Agencia de Anuncios — AI Local
echo ============================================
echo.

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    where.exe python >nul 2>&1
    if errorlevel 1 (
        echo [ERRO] Python nao encontrado!
        echo Instale em: https://python.org/downloads
        pause
        exit /b 1
    )
)

REM Verificar se dependencias estao instaladas
echo Verificando dependencias...
python -m pip install -r requirements.txt -q 2>nul
if errorlevel 1 (
    python3 -m pip install -r requirements.txt -q 2>nul
)

echo.
echo Iniciando servidor...
echo Abra no navegador: http://localhost:8000
echo Para parar: CTRL+C
echo.

start http://localhost:8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
