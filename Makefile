# Makefile per a entorn de tests de la Masía amb suport multi-node
IMAGE_NAME := socdepoble-tests
CONTAINER_NAME := socdepoble-tests-run
COMPOSE_FILE := docker-compose.yml
HOST_PORT := 8081
REPO_DIR := $(shell pwd)

.PHONY: all build-image run-container run-tests shell clean test-network build-compose

all: build-image

# Construir imatge Docker
build-image:
	@echo "[make] Construint imatge Docker..."
	DOCKER_BUILDKIT=1 docker build -t $(IMAGE_NAME) .

# Executar contenidor amb el repo muntat (per a desenvolupament)
run-container: build-image
	@echo "[make] Executant contenidor amb el repo muntat..."
	docker run --rm -it \
	  --name $(CONTAINER_NAME) \
	  -p $(HOST_PORT):8081 \
	  -v "$(REPO_DIR):/app:delegated" \
	  $(IMAGE_NAME)

# Executar tests dins d'un contenidor (no munta el repo, usa la imatge)
run-tests: build-image
	@echo "[make] Executant tests dins d'un contenidor..."
	docker run --rm \
	  --name $(CONTAINER_NAME) \
	  -p $(HOST_PORT):8081 \
	  -v "$(REPO_DIR)/tests:/app/tests:ro" \
	  -v "$(REPO_DIR)/scripts:/app/scripts:ro" \
	  $(IMAGE_NAME)

# Obrir shell dins d'un contenidor per depuració
shell: build-image
	docker run --rm -it --entrypoint /bin/bash -v "$(REPO_DIR):/app" $(IMAGE_NAME)

# Neteja d'artefactes locals
clean:
	@echo "[make] Netejant artefactes..."
	rm -rf node_modules
	rm -rf tests/.test_server.log || true
	rm -rf data || true

# Construir i arrancar la xarxa de prova multi-node i executar la coreografia
test-network: build-image build-compose
	@echo "[make] Iniciant prova multi-node..."
	# Assegurar directoris de dades nets
	rm -rf data || true
	mkdir -p data/node1 data/node2 data/node3
	# Llençar docker-compose en mode detached
	docker-compose -f $(COMPOSE_FILE) up --build -d
	# Esperar que l'orquestrador acabe la prova (l'orquestrador s'atura quan la prova acaba)
	@echo "[make] Esperant finalització de l'orquestrador..."
	# Pollar l'estat del contenidor orchestrator
	@while docker ps --filter "name=socdepoble-orchestrator" --format '{{.Names}}' | grep -q socdepoble-orchestrator; do \
	  sleep 2; \
	done
	@echo "[make] Prova multi-node finalitzada. Recollint logs..."
	docker-compose -f $(COMPOSE_FILE) logs --no-color orchestrator > tests/network_orchestrator.log || true
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	@echo "[make] Logs guardats a tests/network_orchestrator.log"

# Assegura que docker-compose.yml existeix i la imatge està construïda
build-compose: build-image
	@echo "[make] Verificant docker-compose..."
	@test -f $(COMPOSE_FILE) || (echo "Error: $(COMPOSE_FILE) no trobat"; exit 1)
