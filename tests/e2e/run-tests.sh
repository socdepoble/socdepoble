#!/bin/bash

# --- Colors per a la sortida ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# --- Funció per a mostrar errors ---
error_exit() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

# --- Funció per a mostrar missatges ---
log_message() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

success_message() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# --- Comprovar si Docker i Docker Compose estan instal·lats ---
if ! command -v docker &> /dev/null; then
    error_exit "Docker no està instal·lat. Instal·la Docker i torna a intent-ho."
fi

if ! command -v docker-compose &> /dev/null; then
    error_exit "Docker Compose no està instal·lat. Instal·la Docker Compose i torna a intent-ho."
fi

# --- Comprovar si el fitxer pwa-ios.spec.js existeix ---
if [ ! -f "pwa-ios.spec.js" ]; then
    error_exit "El fitxer pwa-ios.spec.js no existeix. Assegura't que estàs al directori correcte."
fi

# --- Passos del script ---
log_message "Iniciant entorn de proves automatitzat per a PWA + WKWebView..."

# --- Pas 1: Construir el contenidor ---
log_message "Construint el contenidor Docker..."
docker-compose build || error_exit "No s'ha pogut construir el contenidor Docker."
success_message "Contenidor construït amb èxit."

# --- Pas 2: Arrencar el servei en segon pla ---
log_message "Arrencant el servei en segon pla..."
docker-compose up -d || error_exit "No s'ha pogut arrencar el servei."
success_message "Servei arrencat (ID: $(docker-compose ps -q))."

# --- Esperar que Vite estigui llest (5 segons) ---
log_message "Esperant que Vite estigui llest..."
sleep 5

# --- Pas 3: Comprovar que Vite està servint HTTPS ---
log_message "Comprovant connexió HTTPS a Vite..."
if ! curl -k https://localhost:5173 > /dev/null 2>&1; then
    error_exit "No s'ha pogut connectar a Vite (HTTPS://localhost:5173)."
fi
success_message "Vite està servint a HTTPS://localhost:5173."

# --- Pas 4: Executar els tests de Playwright ---
log_message "Executant tests E2E amb Playwright (WebKit)..."
docker-compose exec pwa-tests npx playwright test --project=webkit || error_exit "Els tests han fallat."
success_message "Tests executats amb èxit."

# --- Pas 5: Generar informe HTML (opcional) ---
log_message "Generant informe HTML dels tests..."
docker-compose exec pwa-tests npx playwright show-report || log_message "No s'ha pogut generar l'informe (pot ser que no hi hagi resultats)."

# --- Pas 6: Mostrar logs del contenidor (opcional) ---
log_message "Mostrant logs del contenidor..."
docker-compose logs pwa-tests

# --- Missatge final ---
success_message "========================================"
success_message "Entorn de proves finalitzat!"
success_message "- Vite: HTTPS://localhost:5173"
success_message "- Tests: Executat amb Playwright + WebKit"
success_message "- Informe: Disponible a /test-results/ (dins del contenidor)"
success_message "========================================"
