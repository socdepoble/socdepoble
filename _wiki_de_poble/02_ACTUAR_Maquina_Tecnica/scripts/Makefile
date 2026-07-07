SHELL := /bin/sh
NODE ?= node
NPM ?= npm
PREFIX ?= $(HOME)/.local/bin
PWD := $(shell pwd)

.PHONY: ajuda install instal·lar desinstal·lar check audit snapshot daemon permisos

ajuda:
	@echo "make instal·lar      # instal·la sdp i sdp-daemon a $(PREFIX)"
	@echo "make check           # passa mètriques Trellat"
	@echo "make snapshot        # crea snapshot"
	@echo "make daemon          # executa daemon en primer pla"
	@echo "make desinstal·lar   # elimina enllaços"

permisos:
	@chmod +x "$(PWD)/sdp.mjs" "$(PWD)/daemon.mjs"
	@mkdir -p "$(PREFIX)"

install: instal·lar

instal·lar: permisos
	@$(NPM) install --omit=dev --no-audit --no-fund
	@ln -sf "$(PWD)/sdp.mjs" "$(PREFIX)/sdp"
	@ln -sf "$(PWD)/daemon.mjs" "$(PREFIX)/sdp-daemon"
	@echo "Instal·lat: $(PREFIX)/sdp"
	@echo "Assegura PATH: export PATH=\"$(PREFIX):$$PATH\""

desinstal·lar:
	@rm -f "$(PREFIX)/sdp" "$(PREFIX)/sdp-daemon"
	@echo "Desinstal·lat."

check:
	@$(NODE) "$(PWD)/sdp.mjs" check --json

audit:
	@$(NODE) "$(PWD)/sdp.mjs" audit --json

snapshot:
	@$(NODE) "$(PWD)/sdp.mjs" snapshot --json

daemon:
	@$(NODE) --expose-gc "$(PWD)/daemon.mjs"
