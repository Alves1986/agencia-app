#!/bin/bash
echo "============================================"
echo "  Agencia de Anuncios — AI Local"
echo "============================================"
echo ""

# Verificar se Python esta instalado
if ! command -v python3 &> /dev/null; then
    echo "[ERRO] Python3 nao encontrado!"
    echo "Instale: brew install python3 (Mac) ou apt install python3 (Linux)"
    exit 1
fi

# Verificar dependencias
echo "Verificando dependencias..."
pip3 install -r requirements.txt -q

echo ""
echo "Iniciando servidor..."
echo "Abra no navegador: http://localhost:8000"
echo ""

# Abrir navegador (Mac)
if command -v open &> /dev/null; then
    open http://localhost:8000
# Abrir navegador (Linux)
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8000
fi

python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
