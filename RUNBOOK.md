# RUNBOOK Fortificació Fase 1

**Objectiu**  
Guia operativa completa per a aplicar, verificar, fer backup i, si cal, revertir la Fortificació Fase 1 (storageAdapter, stateLedger, routeGuards). Inclou procediments per a backups globals i backups per usuari (user‑scoped), restauració automàtica, checks d’integritat i playbook d’emergència.

---

## Resum executiu
- **Branca de treball**: `feat/fortificacio-fase1`
- **Scripts clau**: `apply_facades_real.sh`, `apply_facades_dryrun.sh`, `backup_localstorage.sh`, `export_backup_to_s3.sh`, `restore_and_test.sh`
- **Directori backups**: `backups_localstorage/`
- **Health dashboard**: `src/components/HealthDashboard.jsx` i `health_console.js`
- **E2E**: `tests/puppeteer/fortify_e2e.js`
- **CI workflow**: `.github/workflows/e2e-bancal.yml`

---

## Playbook d'Emergència
Si alguna cosa falla, executar: `./restore_and_test.sh`
