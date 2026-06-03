#!/usr/bin/env node
// generate-ansible-zip.js
// Genera l'estructura completa del projecte Ansible i empaqueta en ZIP.
// Valencià estricte.

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const OUT_DIR = path.resolve(process.cwd(), 'deploy-ansible');
const ZIP_PATH = path.resolve(process.cwd(), 'deploy-ansible-package.zip');

async function writeFileSafe(p, content) {
  await fs.ensureDir(path.dirname(p));
  await fs.writeFile(p, content, 'utf8');
}

async function createStructure() {
  // group_vars/all.yml
  await writeFileSafe(path.join(OUT_DIR, 'group_vars', 'all.yml'), `---
sdp_user: sdp
sdp_group: sdp
install_dir: /opt/sdp
reports_dir: /var/lib/sdp-reports
dashboard_dir: /var/www/sdp-dashboard
nginx_site: /etc/nginx/sites-available/sdp-dashboard.conf
domain_name: dashboard.socdepoble.org
email_admin: ops@socdepoble.org
certbot_webroot: /var/lib/letsencrypt
ufw_allowed_ports:
  - 22
  - 80
  - 443
`);

  // inventory.ini (exemple)
  await writeFileSafe(path.join(OUT_DIR, 'inventory.ini'), `[edge]
raspberry1 ansible_host=192.0.2.10 ansible_user=ubuntu
`);

  // vault placeholder (usuari ha de xifrar amb ansible-vault)
  await writeFileSafe(path.join(OUT_DIR, 'vault', 'secrets.yml'), `# Exemple: editar amb ansible-vault create vault/secrets.yml
---
webhook_url: "https://hooks.example.com/health"
telegram_bot_token: "REPLACE_ME"
telegram_chat_id: "REPLACE_ME"
`);

  // playbook.yml
  await writeFileSafe(path.join(OUT_DIR, 'playbook.yml'), `---
- name: Desplegament Soc de Poble modular
  hosts: edge
  become: true
  vars_files:
    - group_vars/all.yml
    - vault/secrets.yml

  pre_tasks:
    - name: Crear directori de backups si no existeix
      file:
        path: /var/backups/sdp-snapshots
        state: directory
        owner: root
        group: root
        mode: '0750'

    - name: Crear snapshot abans del deploy
      command: /opt/sdp/scripts/snapshot-before-deploy.sh
      args:
        creates: /var/backups/sdp-snapshots/latest
      register: snapshot_result
      changed_when: false

  roles:
    - node
    - nginx
    - certbot
    - ufw
    - systemd

  post_tasks:
    - name: Comprovar nginx i serveis
      shell: |
        nginx -t && systemctl is-active --quiet nginx
      register: check_result
      failed_when: check_result.rc != 0
`);

  // rollback.yml
  await writeFileSafe(path.join(OUT_DIR, 'rollback.yml'), `---
- name: Rollback Soc de Poble a snapshot anterior
  hosts: edge
  become: true
  vars_files:
    - group_vars/all.yml
    - vault/secrets.yml

  tasks:
    - name: Trobar snapshot latest
      stat:
        path: /var/backups/sdp-snapshots/latest
      register: latest_snap

    - name: Error si no hi ha snapshot
      fail:
        msg: "No hi ha snapshot per restaurar"
      when: not latest_snap.stat.exists

    - name: Parar nginx per restauració segura
      service:
        name: nginx
        state: stopped

    - name: Executar script de restauració
      command: /opt/sdp/scripts/restore-snapshot.sh /var/backups/sdp-snapshots/latest
      register: restore_out
      failed_when: restore_out.rc != 0

    - name: Recarregar nginx
      service:
        name: nginx
        state: restarted

    - name: Reiniciar timers i serveis systemd
      systemd:
        name: "{{ item }}"
        state: restarted
      loop:
        - health-sentinel.timer
        - ghost-tracker.timer
        - sdp-certbot-renew.timer

    - name: Notificar rollback via webhook si definit
      uri:
        url: "{{ webhook_url }}"
        method: POST
        headers:
          Content-Type: "application/json"
        body: >
          {
            "event": "rollback",
            "run_id": "{{ lookup('env','GITHUB_RUN_ID') | default('manual') }}",
            "snapshot": "/var/backups/sdp-snapshots/latest",
            "timestamp": "{{ ansible_date_time.iso8601 }}"
          }
        status_code: 200,201,202
      when: webhook_url is defined
`);

  // roles/nginx files
  await writeFileSafe(path.join(OUT_DIR, 'roles', 'nginx', 'tasks', 'main.yml'), `---
- name: Instal·lar nginx
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Crear directori per al dashboard
  file:
    path: "{{ dashboard_dir }}"
    state: directory
    owner: www-data
    group: www-data
    mode: '0755'

- name: Plantilla nginx site
  template:
    src: sdp-dashboard.conf.j2
    dest: "{{ nginx_site }}"
    owner: root
    group: root
    mode: '0644'
  notify: Test nginx config and reload

- name: Enllaçar site a sites-enabled
  file:
    src: "{{ nginx_site }}"
    dest: /etc/nginx/sites-enabled/sdp-dashboard.conf
    state: link
  notify: Test nginx config and reload

- name: Eliminar default site
  file:
    path: /etc/nginx/sites-enabled/default
    state: absent
  notify: Test nginx config and reload
`);

  await writeFileSafe(path.join(OUT_DIR, 'roles', 'nginx', 'handlers', 'main.yml'), `---
- name: Test nginx config and reload
  block:
    - name: Test nginx configuration
      command: nginx -t
      register: nginx_test
      failed_when: nginx_test.rc != 0

    - name: Reload nginx
      service:
        name: nginx
        state: reloaded
`);

  await writeFileSafe(path.join(OUT_DIR, 'roles', 'nginx', 'templates', 'sdp-dashboard.conf.j2'), `server {
  listen 80;
  listen [::]:80;
  server_name {{ domain_name }};

  location /.well-known/acme-challenge/ {
    root {{ certbot_webroot }};
  }

  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name {{ domain_name }};

  ssl_certificate /etc/letsencrypt/live/{{ domain_name }}/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/{{ domain_name }}/privkey.pem;
  ssl_trusted_certificate /etc/letsencrypt/live/{{ domain_name }}/chain.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_prefer_server_ciphers on;
  ssl_session_timeout 1d;
  ssl_session_cache shared:SSL:50m;
  ssl_session_tickets off;
  ssl_stapling on;
  ssl_stapling_verify on;
  resolver 1.1.1.1 8.8.8.8 valid=300s;
  resolver_timeout 5s;

  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Cache-Control "no-store";

  client_max_body_size 1M;
  client_body_timeout 10s;
  send_timeout 10s;
  keepalive_timeout 15s;
  limit_req_zone $binary_remote_addr zone=one:10m rate=10r/m;

  root {{ dashboard_dir }};
  index index.html;

  location = / {
    try_files /index.html =404;
  }

  location /assets/ {
    try_files $uri $uri/ =404;
    access_log off;
    expires 1d;
  }

  location ^~ /reports/ {
    alias {{ reports_dir }}/;
    autoindex off;
    add_header X-Content-Type-Options nosniff;
    add_header Cache-Control "no-store";
    limit_req zone=one burst=5 nodelay;
    if ($request_method !~ ^(GET|HEAD)$) {
      return 405;
    }
  }

  location / {
    return 404;
  }

  access_log /var/log/nginx/sdp-dashboard.access.log combined buffer=16k;
  error_log /var/log/nginx/sdp-dashboard.error.log warn;
}
`);

  // roles/node
  await writeFileSafe(path.join(OUT_DIR, 'roles', 'node', 'tasks', 'main.yml'), `---
- name: Instal·lar dependències per Node
  apt_key:
    url: https://deb.nodesource.com/gpgkey/nodesource.gpg.key
    state: present
  ignore_errors: yes

- name: Afegir repositori NodeSource
  apt_repository:
    repo: "deb https://deb.nodesource.com/node_20.x {{ ansible_distribution_release }} main"
    state: present
  when: ansible_facts['os_family'] == 'Debian'

- name: Instal·lar nodejs
  apt:
    name: nodejs
    state: present
    update_cache: yes

- name: Crear directori d'instal·lació
  file:
    path: "{{ install_dir }}"
    state: directory
    owner: "{{ sdp_user }}"
    group: "{{ sdp_group }}"
    mode: '0750'
`);

  // roles/systemd
  await writeFileSafe(path.join(OUT_DIR, 'roles', 'systemd', 'tasks', 'main.yml'), `---
- name: Copiar unitats systemd al node
  copy:
    src: "{{ item }}"
    dest: /etc/systemd/system/{{ item }}
    owner: root
    group: root
    mode: '0644'
  loop:
    - health-sentinel.service
    - health-sentinel.timer
    - ghost-tracker.service
    - ghost-tracker.timer
    - sdp-certbot-renew.service
    - sdp-certbot-renew.timer

- name: Recarregar systemd
  command: systemctl daemon-reload

- name: Habilitar i iniciar timers i serveis
  systemd:
    name: "{{ item }}"
    enabled: yes
    state: started
  loop:
    - health-sentinel.timer
    - ghost-tracker.timer
    - sdp-certbot-renew.timer
`);

  // roles/ufw
  await writeFileSafe(path.join(OUT_DIR, 'roles', 'ufw', 'tasks', 'main.yml'), `---
- name: Instal·lar ufw
  apt:
    name: ufw
    state: present
    update_cache: yes

- name: Permetre ports essencials
  ufw:
    rule: allow
    port: "{{ item }}"
  loop: "{{ ufw_allowed_ports }}"

- name: Establir política per defecte deny incoming
  ufw:
    state: enabled
    policy: deny
    direction: incoming
  ignore_errors: yes
`);

  // roles/certbot
  await writeFileSafe(path.join(OUT_DIR, 'roles', 'certbot', 'tasks', 'main.yml'), `---
- name: Instal·lar certbot i plugin nginx
  apt:
    name:
      - certbot
      - python3-certbot-nginx
    state: present
    update_cache: yes

- name: Crear webroot per ACME
  file:
    path: "{{ certbot_webroot }}"
    state: directory
    owner: www-data
    group: www-data
    mode: '0755'

- name: Sol·licitar certificat Let's Encrypt webroot
  command: >
    certbot certonly --webroot -w {{ certbot_webroot }}
    -d {{ domain_name }} --email {{ email_admin }} --agree-tos --non-interactive
  register: certbot_result
  changed_when: "'Congratulations' in certbot_result.stdout or certbot_result.rc == 0"
  failed_when: certbot_result.rc not in [0,1]
  notify: Reload nginx
  ignore_errors: yes

- name: Copiar unitat de renovació certbot
  copy:
    src: sdp-certbot-renew.service
    dest: /etc/systemd/system/sdp-certbot-renew.service
    owner: root
    group: root
    mode: '0644'
  notify: systemd daemon-reload
`);

  await writeFileSafe(path.join(OUT_DIR, 'roles', 'certbot', 'handlers', 'main.yml'), `---
- name: Reload nginx
  service:
    name: nginx
    state: reloaded

- name: systemd daemon-reload
  command: systemctl daemon-reload
`);

  // files
  const filesDir = path.join(OUT_DIR, 'files');
  await writeFileSafe(path.join(filesDir, 'health-sentinel.service'), `[Unit]
Description=Health Sentinel for Soc de Poble
After=network.target

[Service]
Type=simple
User=sdp
Group=sdp
WorkingDirectory=/opt/sdp
ExecStart=/usr/bin/node /opt/sdp/tools/health-sentinel.cjs --mode runtime --baseUrl http://localhost:5173 --webhook https://hooks.example.com/health --interval 300000
Restart=on-failure
RestartSec=10
LimitNOFILE=4096
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`);
  await writeFileSafe(path.join(filesDir, 'health-sentinel.timer'), `[Unit]
Description=Run Health Sentinel periodic quick check

[Timer]
OnBootSec=1min
OnUnitActiveSec=10min
Unit=health-sentinel.service

[Install]
WantedBy=timers.target
`);
  await writeFileSafe(path.join(filesDir, 'ghost-tracker.service'), `[Unit]
Description=Ghost Tracker AST Analyzer run
After=network.target

[Service]
Type=oneshot
User=sdp
Group=sdp
WorkingDirectory=/opt/sdp
ExecStart=/usr/bin/node /opt/sdp/tools/ghost-tracker.cjs --root /opt/sdp --out /var/lib/sdp-reports/ghost-report.json
TimeoutStartSec=600
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
`);
  await writeFileSafe(path.join(filesDir, 'ghost-tracker.timer'), `[Unit]
Description=Run Ghost Tracker nightly

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true
Unit=ghost-tracker.service

[Install]
WantedBy=timers.target
`);
  await writeFileSafe(path.join(filesDir, 'sdp-certbot-renew.service'), `[Unit]
Description=Renew Let's Encrypt certificates for SDP Dashboard
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
User=root
ExecStart=/usr/bin/certbot renew --quiet --deploy-hook "systemctl reload nginx"
`);
  await writeFileSafe(path.join(filesDir, 'sdp-certbot-renew.timer'), `[Unit]
Description=Timer per renovar certificats Let's Encrypt SDP

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
`);
  await writeFileSafe(path.join(filesDir, 'dashboard-index-placeholder.html'), `<!doctype html><html><head><meta charset="utf-8"><title>SDP Dashboard</title></head><body><h1>Dashboard placeholder</h1></body></html>`);

  // scripts
  await writeFileSafe(path.join(OUT_DIR, 'scripts', 'snapshot-before-deploy.sh'), `#!/usr/bin/env bash
set -euo pipefail
TIMESTAMP=$(date +%Y%m%dT%H%M%S)
SNAP_DIR="/var/backups/sdp-snapshots/\${TIMESTAMP}"
mkdir -p "\${SNAP_DIR}"
if [ -d /var/www/sdp-dashboard ]; then
  tar -czf "\${SNAP_DIR}/dashboard-\${TIMESTAMP}.tar.gz" -C /var/www sdp-dashboard
fi
if [ -d /var/lib/sdp-reports ]; then
  tar -czf "\${SNAP_DIR}/reports-\${TIMESTAMP}.tar.gz" -C /var/lib sdp-reports
fi
ln -sfn "\${SNAP_DIR}" /var/backups/sdp-snapshots/latest
echo "Snapshot creat: \${SNAP_DIR}"
`);
  await writeFileSafe(path.join(OUT_DIR, 'scripts', 'restore-snapshot.sh'), `#!/usr/bin/env bash
set -euo pipefail
SNAPSHOT_DIR=\${1:-/var/backups/sdp-snapshots/latest}
if [ ! -d "\${SNAPSHOT_DIR}" ]; then
  echo "Snapshot no trobat: \${SNAPSHOT_DIR}"
  exit 1
fi
if ls \${SNAPSHOT_DIR}/dashboard-*.tar.gz 1> /dev/null 2>&1; then
  rm -rf /var/www/sdp-dashboard
  tar -xzf \${SNAPSHOT_DIR}/dashboard-*.tar.gz -C /var/www
  chown -R www-data:www-data /var/www/sdp-dashboard
fi
if ls \${SNAPSHOT_DIR}/reports-*.tar.gz 1> /dev/null 2>&1; then
  rm -rf /var/lib/sdp-reports
  tar -xzf \${SNAPSHOT_DIR}/reports-*.tar.gz -C /var/lib
  chown -R www-data:www-data /var/lib/sdp-reports
fi
echo "Restauració completada"
`);

  // Make scripts executable
  await fs.chmod(path.join(OUT_DIR, 'scripts', 'snapshot-before-deploy.sh'), 0o755);
  await fs.chmod(path.join(OUT_DIR, 'scripts', 'restore-snapshot.sh'), 0o755);

  // Create ZIP
  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ZIP_PATH);
    const archive = archiver('zip', { zlib: { level: 9 }});
    output.on('close', () => resolve());
    archive.on('error', err => reject(err));
    archive.pipe(output);
    archive.directory(OUT_DIR, false);
    archive.finalize();
  });

  console.log('Paquet creat:', ZIP_PATH);
}

createStructure().catch(err => {
  console.error('Error generant paquet:', err);
  process.exit(1);
});
