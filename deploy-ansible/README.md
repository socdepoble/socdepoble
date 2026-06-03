# Soc de Poble — Paquet d'Infraestructura i Operacions

Aquest document és la **Bíblia Operativa** per a desplegar, mantenir i restaurar la infraestructura de `Sóc de Poble`. Conté instruccions pas a pas per generar el paquet, gestionar secrets, executar el deploy via GitHub Actions i restaurar manualment si cal.

> **Idioma**: Valencià estricte  
> **Àmbit**: Raspberry / Ubuntu Server / entorn rural resilient

---

## Contingut del paquet

Estructura principal:

```
deploy-ansible/
├─ inventory.ini
├─ playbook.yml
├─ rollback.yml
├─ group_vars/all.yml
├─ vault/secrets.yml        # xifrat amb ansible-vault
├─ roles/                  # rols modulars: nginx, node, systemd, ufw, certbot
├─ files/                  # unitats systemd i fitxers estàtics
├─ scripts/                # snapshot-before-deploy.sh, restore-snapshot.sh
└─ README.md               # aquest fitxer
```

---

## 1. Generar el ZIP amb l'estructura (script)

Si prefereixes generar el paquet automàticament, hi ha un script Node.js:

**Ubicació**: `tools/generate-ansible-zip.js`

**Requisits locals**:
- Node.js >= 16
- `npm install archiver fs-extra`

**Com executar**:
```bash
cd <repo-arrel>
npm install archiver fs-extra
node tools/generate-ansible-zip.js
# Resultat: deploy-ansible-package.zip
```

Descomprimeix `deploy-ansible-package.zip` al directori on faràs el deploy o copia directament la carpeta `deploy-ansible/` al teu repositori.

---

## 2. Preparar Ansible Vault (secrets)

Els secrets s'emmagatzemen en `deploy-ansible/vault/secrets.yml` i **han d'estar xifrats** amb Ansible Vault.

**Crear el fitxer xifrat**:
```bash
cd deploy-ansible
ansible-vault create vault/secrets.yml
# L'editor s'obrirà; enganxa el YAML amb les claus (webhook_url, telegram_bot_token, etc.)
```

**Editar el fitxer xifrat**:
```bash
ansible-vault edit vault/secrets.yml
```

**Variables típiques dins del Vault**:
```yaml
webhook_url: "https://hooks.example.com/health"
telegram_bot_token: "123456:ABC-DEF..."
telegram_chat_id: "987654321"
aws_access_key_id: "AKIA..."
aws_secret_access_key: "..."
```

**No** commiteges el fitxer en text pla. El fitxer `vault/secrets.yml` pot existir en el repo però sempre xifrat.

---

## 3. Configurar secrets a GitHub Actions

Afegeix aquests secrets a **Settings → Secrets and variables → Actions** del repositori:

- `DEPLOY_SSH_KEY` — clau privada SSH (PEM) per al node (deploy key).  
- `DEPLOY_HOST` — IP o hostname del node.  
- `DEPLOY_USER` — usuari SSH (p.ex. `ubuntu`).  
- `DEPLOY_PORT` — port SSH (opcional, per defecte 22).  
- `ANSIBLE_VAULT_PASSWORD` — contrasenya d’Ansible Vault.  
- `TELEGRAM_BOT_TOKEN` — token del bot Telegram (opcional).  
- `TELEGRAM_CHAT_ID` — id del xat Telegram (opcional).  
- `WEBHOOK_URL` — URL del webhook d’alertes (opcional).

**Recomanació**: utilitza un gestor de secrets corporatiu per rotar i auditar contrasenyes.

---

## 4. Procediment de desplegament (CI)

El workflow `/.github/workflows/deploy.yml` fa:

1. Checkout del codi.  
2. Instal·la Ansible al runner.  
3. Escriu la clau SSH i inicia `ssh-agent`.  
4. Escriu `.vault_pass` amb la contrasenya del Vault (permet a `ansible-playbook` desxifrar).  
5. Executa `ansible-playbook playbook.yml`.  
6. Si falla, executa `ansible-playbook rollback.yml`.  
7. Notifica via Telegram i webhook segons configuració.  
8. Pugeu logs com artifacts.

**Com llançar manualment** (local):
```bash
cd deploy-ansible
ansible-playbook -i inventory.ini playbook.yml --ask-vault-pass
# o amb fitxer de contrasenya:
ansible-playbook -i inventory.ini playbook.yml --vault-password-file /path/to/.vault_pass
```

---

## 5. Snapshot abans del deploy i rollback automàtic

**Snapshot automàtic**: el playbook executa `/opt/sdp/scripts/snapshot-before-deploy.sh` abans de fer canvis. Aquest script crea un tar.gz de:

- `/var/www/sdp-dashboard` → `dashboard-<timestamp>.tar.gz`  
- `/var/lib/sdp-reports` → `reports-<timestamp>.tar.gz`  

Els snapshots es guarden a `/var/backups/sdp-snapshots/<timestamp>/` i `latest` apunta al darrer snapshot.

**Rollback automàtic**: si el deploy falla, el workflow executa `rollback.yml` que:

1. Para `nginx`.  
2. Executa `/opt/sdp/scripts/restore-snapshot.sh /var/backups/sdp-snapshots/latest`.  
3. Reinicia `nginx` i timers systemd.  
4. Notifica via webhook si està configurat.

---

## 6. Restauració manual (procediment d'emergència)

Si el CI no ha pogut restaurar automàticament, segueix aquests passos:

1. Connecta't al node per SSH com a usuari amb permisos `sudo`.  
2. Comprova snapshots disponibles:
   ```bash
   ls -la /var/backups/sdp-snapshots
   ls -la /var/backups/sdp-snapshots/<timestamp>
   ```
3. Parar nginx:
   ```bash
   sudo systemctl stop nginx
   ```
4. Restaurar snapshot (exemple amb `latest`):
   ```bash
   sudo /opt/sdp/scripts/restore-snapshot.sh /var/backups/sdp-snapshots/latest
   ```
5. Reiniciar nginx i serveis:
   ```bash
   sudo systemctl restart nginx
   sudo systemctl restart health-sentinel.timer
   sudo systemctl restart ghost-tracker.timer
   ```
6. Verificar el Dashboard i els reports: `https://<domain>` i `/reports/ghost-report.json`.  
7. Registrar l'incident i el run id del CI per auditoria.

---

## 7. Checklist operatiu (prèvia a desplegar)

- [ ] Tenir còpia del `DEPLOY_SSH_KEY` i `ANSIBLE_VAULT_PASSWORD` en gestor segur.  
- [ ] `domain_name` i `email_admin` configurats a `group_vars/all.yml`.  
- [ ] `vault/secrets.yml` creat i xifrat amb `ansible-vault`.  
- [ ] Prova local del playbook en entorn canari.  
- [ ] Assegurar que `/var/backups/sdp-snapshots` té espai suficient.  
- [ ] Confirmar que `DEPLOY_HOST` resol i accepta la deploy key.  
- [ ] Revisar `roles/nginx/templates/sdp-dashboard.conf.j2` per rutes i CSP.  
- [ ] Revisar `scripts/snapshot-before-deploy.sh` i `restore-snapshot.sh` i donar permisos `chmod +x`.  
- [ ] Configurar notificacions (Telegram / webhook) si voleu alertes automàtiques.  
- [ ] Provar rollback manual en entorn de prova.

---

## 8. Com provar el sistema en un entorn canari

1. Configura un node de prova amb Ubuntu.  
2. Copia el paquet `deploy-ansible/` al control host.  
3. Crea `inventory.ini` apuntant al node de prova.  
4. Crea `vault/secrets.yml` amb `ansible-vault create`.  
5. Executa:
   ```bash
   ansible-playbook -i inventory.ini playbook.yml --ask-vault-pass
   ```
6. Força una fallada (p.ex. canvia una ruta a `nginx` per fer fallar `nginx -t`) i comprova que el workflow (o la prova manual) executa `rollback.yml` correctament.

---

## 9. Bones pràctiques de seguretat

- **No** posar secrets en el repo. Utilitza Ansible Vault i GitHub Secrets.  
- Rotar les claus SSH i les credencials periòdicament.  
- Limitar l'accés SSH per IP si és possible.  
- Protegir endpoints `/internal/*` amb token i limitar a localhost.  
- Fer backups periòdics dels snapshots i emmagatzemar-los fora del node si cal.

---

## 10. Contactes i procediments d'escalat

- Equip Ops: `ops@socdepoble.org`  
- En cas d'incident crític: activar el canal d'urgència (Telegram) i obrir ticket amb `run_id` del CI i logs adjunts.
