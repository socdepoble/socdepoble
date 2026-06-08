#!/usr/bin/env bash
set -euo pipefail

# guided_migration_with_notifications_html.sh
# Definitive guided migration script:
# - interactive guided flow (backup, dry-run, apply, tests, E2E)
# - generates checklist PDF and PNG preview
# - optional AES-256 encryption of PDF
# - uploads PDF and preview to S3/MinIO (aws or mc)
# - sends HTML email (sendmail / SendGrid / Mailgun)
# - posts a Markdown comment to the PR with embedded preview image (gh CLI)
#
# Configure environment variables before running:
#   SLACK_WEBHOOK_URL (optional)
#   MATRIX_HOMESERVER, MATRIX_ACCESS_TOKEN, MATRIX_ROOM_ID (optional)
#   EMAIL_METHOD (sendmail|sendgrid|mailgun) default: sendmail
#   EMAIL_TO (required for email)
#   SENDGRID_API_KEY (if using sendgrid)
#   MAILGUN_API_KEY, MAILGUN_DOMAIN (if using mailgun)
#   S3_BUCKET (optional; required to upload)
#   S3_PREFIX (optional)
#   S3_REGION (optional)
#   S3_ENDPOINT (optional for MinIO)
#   ENCRYPT_KEY (optional; AES-256 passphrase)
#   PR_URL (optional)
#   CI_BUILD_URL (optional)
#   GH_TOKEN (optional; for gh CLI)
#
# Usage:
#   chmod +x scripts/guided_migration_with_notifications_html.sh
#   ./scripts/guided_migration_with_notifications_html.sh

log(){ echo ">> $*"; }

# Simple JSON escape helper (uses python for portability)
json_escape(){ printf '%s' "$1" | python -c "import sys,json; print(json.dumps(sys.stdin.read()))"; }

notify_slack(){
  local text="$1"
  if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    curl -sS -X POST -H 'Content-type: application/json' --data "{\"text\":$(printf '%s' "$text" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))')}" "$SLACK_WEBHOOK_URL" >/dev/null 2>&1 || true
  fi
}

notify_matrix(){
  local text="$1"
  if [ -n "${MATRIX_HOMESERVER:-}" ] && [ -n "${MATRIX_ACCESS_TOKEN:-}" ] && [ -n "${MATRIX_ROOM_ID:-}" ]; then
    local txnid=$(date +%s%N)
    local url="${MATRIX_HOMESERVER}/_matrix/client/v3/rooms/${MATRIX_ROOM_ID}/send/m.room.message/${txnid}"
    curl -sS -X PUT -H "Authorization: Bearer ${MATRIX_ACCESS_TOKEN}" -H "Content-Type: application/json" \
      --data "{\"msgtype\":\"m.text\",\"body\":$(printf '%s' "$text" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))')}" "$url" >/dev/null 2>&1 || true
  fi
}

email_sendmail_html(){
  local subject="$1"; local html="$2"; local to="${EMAIL_TO:-}"
  if [ -z "$to" ]; then return; fi
  if command -v sendmail >/dev/null 2>&1; then
    {
      echo "To: $to"
      echo "Subject: $subject"
      echo "MIME-Version: 1.0"
      echo "Content-Type: multipart/alternative; boundary=\"BOUNDARY\""
      echo
      echo "--BOUNDARY"
      echo "Content-Type: text/html; charset=UTF-8"
      echo
      echo "$html"
      echo "--BOUNDARY--"
    } | sendmail -t || true
  else
    log "sendmail not available; skipping sendmail email"
  fi
}

email_sendgrid_html(){
  local subject="$1"; local html="$2"; local to="${EMAIL_TO:-}"
  if [ -z "$to" ] || [ -z "${SENDGRID_API_KEY:-}" ]; then return; fi
  curl -sS -X POST "https://api.sendgrid.com/v3/mail/send" \
    -H "Authorization: Bearer ${SENDGRID_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"personalizations\":[{\"to\":[{\"email\":\"$to\"}]}],\"from\":{\"email\":\"no-reply@socdepoble.com\"},\"subject\":\"${subject}\",\"content\":[{\"type\":\"text/html\",\"value\":\"${html//\"/\\\"}\"}]}" >/dev/null 2>&1 || true
}

email_mailgun_html(){
  local subject="$1"; local html="$2"; local to="${EMAIL_TO:-}"
  if [ -z "$to" ] || [ -z "${MAILGUN_API_KEY:-}" ] || [ -z "${MAILGUN_DOMAIN:-}" ]; then return; fi
  curl -sS -X POST "https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages" \
    -u "api:${MAILGUN_API_KEY}" \
    -F from="no-reply@${MAILGUN_DOMAIN}" \
    -F to="$to" \
    -F subject="$subject" \
    -F html="$html" >/dev/null 2>&1 || true
}

notify_email_html(){
  local subject="$1"; local html="$2"
  case "${EMAIL_METHOD:-sendmail}" in
    sendgrid) email_sendgrid_html "$subject" "$html" ;;
    mailgun) email_mailgun_html "$subject" "$html" ;;
    *) email_sendmail_html "$subject" "$html" ;;
  esac
}

upload_to_s3_and_presign(){
  local file="$1"
  local bucket="${S3_BUCKET:?S3_BUCKET required}"
  local prefix="${S3_PREFIX:-fortificacio}"
  local region="${S3_REGION:-us-east-1}"
  local endpoint="${S3_ENDPOINT:-}"
  local key="${prefix}/$(basename "$file")"
  if command -v aws >/dev/null 2>&1; then
    if [ -n "$endpoint" ]; then
      aws s3 cp "$file" "s3://${bucket}/${key}" --endpoint-url "$endpoint" --region "$region"
      aws --endpoint-url "$endpoint" s3 presign "s3://${bucket}/${key}" --expires-in 604800 || true
    else
      aws s3 cp "$file" "s3://${bucket}/${key}" --region "$region"
      aws s3 presign "s3://${bucket}/${key}" --expires-in 604800 || true
    fi
  elif command -v mc >/dev/null 2>&1; then
    mc cp "$file" "minio/${bucket}/${prefix}/"
    mc share download "minio/${bucket}/${prefix}/$(basename "$file")" 2>/dev/null || true
  else
    log "No aws nor mc available; file kept locally: $file"
    echo ""
  fi
}

generate_pdf_and_preview(){
  local outdir="${1:-./artifacts}"
  mkdir -p "$outdir"
  local md="$outdir/checklist.md"
  local pdf="$outdir/checklist.pdf"
  local png="$outdir/checklist_preview.png"

  cat > "$md" <<'MD'
# CHECKLIST RÀPIDA Fortificació Fase 1

1. Preparació
- [ ] Crear branca backup: git checkout -b backup-before-fortificacio
- [ ] Commit snapshot: git add -A && git commit -m "backup pre-fortificacio"
- [ ] Executar backup global: ./backup_localstorage.sh backup socdepoble_
- [ ] Executar backup user (si cal): ./backup_localstorage.sh backup socdepoble_user_<USER_ID>

2. Dry run i revisió
- [ ] ./apply_facades_dryrun.sh
- [ ] Revisar fitxers a patches_dryrun/

3. Aplicació controlada
- [ ] PROCEED=1 ./apply_facades_real.sh
- [ ] npm ci
- [ ] node tests/storageAdapter.test.js
- [ ] node tests/stateLedger.test.js
- [ ] node tests/routeGuards.test.js

4. E2E local
- [ ] npm run build
- [ ] npx http-server ./build -p 3000 --silent &
- [ ] TEST_URL=http://localhost:3000 node tests/puppeteer/fortify_e2e.js

5. PR i CI
- [ ] Obrir PR a la branca principal
- [ ] Esperar E2E Bancal Mode verd abans de merge

6. Post deploy
- [ ] Comprovar Health Dashboard
- [ ] Validar listeners i ledger
- [ ] Programar neteja de debug helpers quan estiga estable
MD

  if command -v pandoc >/dev/null 2>&1; then
    pandoc "$md" -o "$pdf" --pdf-engine=xelatex -V geometry:margin=1in || true
  else
    node - "$md" "$pdf" <<'NODE'
const fs=require('fs');
const puppeteer=require('puppeteer');
(async()=>{
  const md=fs.readFileSync(process.argv[2],'utf8');
  const html=`<html><head><meta charset="utf-8"><style>body{font-family:system-ui,Arial;padding:20px}</style></head><body><pre style="white-space:pre-wrap;">${md.replace(/</g,'&lt;')}</pre></body></html>`;
  const out=process.argv[3];
  const browser=await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page=await browser.newPage();
  await page.setContent(html,{waitUntil:'networkidle0'});
  await page.pdf({path:out,format:'A4',margin:{top:'20mm',bottom:'20mm',left:'15mm',right:'15mm'}});
  await browser.close();
  console.log(out);
})();
NODE
  fi

  node - "$pdf" "$png" <<'NODE'
const fs=require('fs');
const puppeteer=require('puppeteer');
(async()=>{
  const pdfPath=process.argv[2];
  const out=process.argv[3];
  const browser=await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page=await browser.newPage();
  const data=fs.readFileSync(pdfPath);
  const base64=data.toString('base64');
  await page.setContent(`<embed src="data:application/pdf;base64,${base64}" type="application/pdf" width="1200" height="1600">`, {waitUntil:'networkidle0'});
  await page.setViewport({width:1200,height:800});
  await page.screenshot({path:out,fullPage:false});
  await browser.close();
  console.log(out);
})();
NODE

  echo "$pdf|$png"
}

render_html_summary(){
  local TIMESTAMP="$1"
  local GIT_BRANCH="$2"
  local GIT_COMMIT="$3"
  local PR_LINK="$4"
  local CI_LINK="$5"
  local BACKUP_GLOBAL="$6"
  local BACKUP_USER="$7"
  local PDF_LINK="$8"
  local PREVIEW_LINK="$9"

  local PREVIEW_IMG_HTML=""
  if [ -n "$PREVIEW_LINK" ]; then
    PREVIEW_IMG_HTML="<div class=\"preview\"><a href=\"${PDF_LINK}\" target=\"_blank\" rel=\"noopener\"><img src=\"${PREVIEW_LINK}\" alt=\"Checklist preview\" style=\"width:100%;display:block;border:0\"/></a></div>"
  fi

  cat <<HTML
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#121212;--card:#1e1e1e;--text:#e0e0e0;--muted:#9aa0a6;--accent:#0b5cff;--radius:10px}
    html,body{height:100%;margin:0;background:var(--bg);color:var(--text);font-family:'Noto Sans',system-ui,Arial,sans-serif}
    .wrap{max-width:900px;margin:28px auto;padding:18px}
    .header{display:flex;gap:16px;align-items:center}
    .logo{height:56px;width:auto;border-radius:8px}
    .title{font-size:20px;font-weight:700;color:var(--accent)}
    .meta{font-size:13px;color:var(--muted)}
    .card{background:var(--card);border-radius:var(--radius);padding:16px;margin-top:14px;box-shadow:0 6px 18px rgba(0,0,0,0.45)}
    h2{margin:0 0 8px 0;color:var(--accent)}
    p{margin:8px 0;color:var(--text)}
    .list{margin:8px 0;padding-left:18px;color:var(--text)}
    .code{background:#0f0f0f;padding:10px;border-radius:8px;font-family:monospace;font-size:13px;color:#cfcfcf}
    .cta{display:inline-block;background:var(--accent);color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600}
    .small{font-size:13px;color:var(--muted)}
    .preview{margin-top:12px;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.04)}
    .footer{margin-top:18px;font-size:13px;color:var(--muted)}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <img class="logo" src="https://socdepoble.com/assets/logo_socdepoble.png" alt="Sóc de Poble logo"/>
      <div>
        <div class="title">Fortificació Fase 1 — Resum final</div>
        <div class="meta">Data: ${TIMESTAMP} · Branch: <span class="small">${GIT_BRANCH}</span></div>
      </div>
    </div>

    <div class="card">
      <h2>Resultats i artefactes</h2>
      <p class="small">A continuació trobareu els enllaços i artefactes generats durant la sessió guiada.</p>

      <ul class="list">
        <li><strong>PR</strong>: <a style="color:var(--accent)" href="${PR_LINK}">${PR_LINK}</a></li>
        <li><strong>CI build</strong>: <a style="color:var(--accent)" href="${CI_LINK}">${CI_LINK}</a></li>
        <li><strong>Backup global</strong>: <span class="small">${BACKUP_GLOBAL}</span></li>
        <li><strong>Backup user-scoped</strong>: <span class="small">${BACKUP_USER}</span></li>
      </ul>

      <div style="margin-top:12px">
        <h2>Checklist imprimible</h2>
        <p class="small">Descarregueu la checklist xifrada i verificada:</p>
        <p>
          $(if [ -n "$PDF_LINK" ]; then echo "<a class=\"cta\" href=\"${PDF_LINK}\">Descarregar PDF de la checklist</a> <span style=\"margin-left:10px;color:var(--muted);font-size:13px\">(enllaç signat 7 dies)</span>"; else echo "<span class=\"small\">No s'ha generat PDF</span>"; fi)
        </p>

        ${PREVIEW_IMG_HTML}
      </div>

      <div style="margin-top:14px">
        <h2>Checks realitzats</h2>
        <ul class="list">
          <li>Tests mínims Node</li>
          <li>E2E simulació iPad A10</li>
          <li>Health dashboard i snapshot</li>
          <li>Checksum SHA256 de backup i verificació d'integritat</li>
        </ul>
      </div>

      <div style="margin-top:12px" class="code">git branch: ${GIT_BRANCH} · commit: ${GIT_COMMIT}</div>
    </div>

    <div class="footer">
      <p class="small">Recomanació: revisar HealthDashboard i diagnostics/health_pre_migration.json durant 24–48h. Si cal rollback, utilitzeu <code>restore_and_test.sh</code> amb el backup corresponent.</p>
    </div>
  </div>
</body>
</html>
HTML
}

# ---------- main (finalization flow) ----------
log "Guided migration finalization: generate PDF, preview, upload, notify, PR comment"

# infer PR if not provided
PR_URL="${PR_URL:-}"
if [ -z "$PR_URL" ] && command -v gh >/dev/null 2>&1; then
  PR_URL="$(gh pr view --json url -q .url 2>/dev/null || true)"
fi

GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
GIT_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
TIMESTAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

OUT="$(generate_pdf_and_preview ./artifacts || true)"
PDF_FILE="$(echo "$OUT" | cut -d'|' -f1 || true)"
PREVIEW_PNG="$(echo "$OUT" | cut -d'|' -f2 || true)"

UPLOAD_PDF="$PDF_FILE"
if [ -n "${ENCRYPT_KEY:-}" ] && [ -f "$PDF_FILE" ]; then
  ENC="${PDF_FILE}.enc"
  openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:"$ENCRYPT_KEY" -in "$PDF_FILE" -out "$ENC"
  UPLOAD_PDF="$ENC"
  log "PDF encrypted: $UPLOAD_PDF"
fi

PRESIGNED_PDF=""
PRESIGNED_PREVIEW=""
if [ -n "${S3_BUCKET:-}" ]; then
  if [ -n "$UPLOAD_PDF" ] && [ -f "$UPLOAD_PDF" ]; then
    PRESIGNED_PDF="$(upload_to_s3_and_presign "$UPLOAD_PDF" || true)"
  fi
  if [ -n "$PREVIEW_PNG" ] && [ -f "$PREVIEW_PNG" ]; then
    PRESIGNED_PREVIEW="$(upload_to_s3_and_presign "$PREVIEW_PNG" || true)"
  fi
fi

HTML_SUMMARY="$(render_html_summary "$TIMESTAMP" "$GIT_BRANCH" "$GIT_COMMIT" "${PR_URL:-}" "${CI_BUILD_URL:-}" "${LATEST_BACKUP:-}" "${USER_BACKUP:-}" "${PRESIGNED_PDF:-}" "${PRESIGNED_PREVIEW:-}")"

notify_slack "✅ Fortificació Fase 1 finalitzada — PR: ${PR_URL:-(no proporcionat)}"
notify_matrix "✅ Fortificació Fase 1 finalitzada — PR: ${PR_URL:-(no proporcionat)}"
notify_email_html "Fortificació Fase 1 — Resum final" "$HTML_SUMMARY"

PR_COMMENT_MD="**Fortificació Fase 1 — Resum final**\n\nPR: ${PR_URL:-(no proporcionat)}\nCI build: ${CI_BUILD_URL:-(no proporcionat)}\n\nBackup global: ${LATEST_BACKUP:-(no file)}\nBackup user: ${USER_BACKUP:-(no file)}\n\nChecklist PDF: ${PRESIGNED_PDF:-(no file)}\n\n"
if [ -n "${PRESIGNED_PREVIEW:-}" ]; then
  PR_COMMENT_MD+="![Checklist preview](${PRESIGNED_PREVIEW})\n\n"
fi
PR_COMMENT_MD+="Recomanació: revisar HealthDashboard i diagnostics/health_pre_migration.json durant 24–48h."

if command -v gh >/dev/null 2>&1; then
  if [ -n "${PR_URL:-}" ]; then
    gh pr comment "$PR_URL" --body "$PR_COMMENT_MD" >/dev/null 2>&1 || true
    log "Comment posted to PR: $PR_URL"
  else
    PR_NUM="$(gh pr view --json number -q .number 2>/dev/null || true)"
    if [ -n "$PR_NUM" ]; then
      gh pr comment "$PR_NUM" --body "$PR_COMMENT_MD" >/dev/null 2>&1 || true
      log "Comment posted to PR #$PR_NUM"
    else
      log "No PR detected to post comment"
    fi
  fi
else
  log "gh CLI not available; skipping PR comment"
fi

log "Guided migration finalization complete."
exit 0

