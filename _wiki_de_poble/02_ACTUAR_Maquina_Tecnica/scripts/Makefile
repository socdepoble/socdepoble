SHELL := /bin/sh
NODE ?= node
HERE := $(CURDIR)

.PHONY: ajuda check audit install instal·lar desinstal·lar snapshot daemon permisos

ajuda:
	@echo "make check  # prevalidació canònica i de només lectura"
	@echo "make audit  # auditoria canònica estricta i de només lectura"
	@echo "Els antics install/snapshot/daemon estan retirats: no validaven el Reflex."

check:
	@$(NODE) "$(HERE)/pre-commit.mjs" --dry-run

audit:
	@$(NODE) "$(HERE)/autoneteja_wiki.mjs" --strict

install instal·lar desinstal·lar snapshot daemon permisos:
	@echo "SDP-LOCK: target retirat; no pot instal·lar, enllaçar, esborrar ni escriure sense un mutador amb Reflex i rollback." >&2
	@exit 2
