#!/usr/bin/env bash
set -euo pipefail

# guided_migration_dryrun.sh
# Dry-run variant of the guided migration finalization:
# - performs all local steps (PDF + preview generation)
# - does NOT upload to S3 or send emails
# - prints the presigned URLs placeholders and local artifact paths
#
# Usage:
#   chmod +x scripts/guided_migration_dryrun.sh
#   ./scripts/guided_migration_dryrun.sh

log(){ echo ">> $*"; }

generate_pdf_and_preview_local(){
  local outdir="${1:-./artifacts}"
  mkdir -p "$outdir"
  local md="$outdir/checklist.md"
  local pdf="$outdir/checklist.pdf"
  local png="$outdir/checklist_preview.png"

  cat > "$md" <<'MD'
# CHECKLIST RÀPIDA Fortificació Fase 1
MD
  # Use pandoc if available, else node+puppeteer fallback
  if command -v pandoc >/dev/null 2>&1; then
    pandoc "$md" -o "$pdf" --pdf-engine=xelatex -V geometry:margin=1in || true
  else
    node - "$md" "$pdf" <<'NODE'
const fs=require('fs');
const puppeteer=require('puppeteer');
(async()=>{
  const md=fs.readFileSync(process.argv[2],'utf8');
  const html=`<html><body><pre>${md.replace(/</g,'&lt;')}</pre></body></html>`;
  const out=process.argv[3];
  const browser=await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page=await browser.newPage();
  await page.setContent(html,{waitUntil:'networkidle0'});
  await page.pdf({path:out,format:'A4'});
  await browser.close();
  console.log(out);
})();
NODE
  fi

  # preview
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
  echo "PDF: $pdf"
  echo "Preview: $png"
}

log "Dry-run: generate local PDF and preview"
generate_pdf_and_preview_local ./artifacts
log "Dry-run complete. No uploads, no emails sent."
exit 0

