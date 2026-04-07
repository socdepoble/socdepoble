#!/bin/bash
set -e

mkdir -p _PAPERERA_OBSOLETA
mkdir -p _HISTORIC_SENSIBLE
mkdir -p _AUDITORIES
mkdir -p _SKILLS
mkdir -p _DOCUMENTACIO_OFICIAL
mkdir -p _PAYLOADS

# Scripts and tests to PAPERERA_OBSOLETA
mv audit2.js audit3.js audit_ai.js audit_comarcas.js audit_missing.js audit_posts.js check_*.js test_*.js test_*.mjs _PAPERERA_OBSOLETA/ 2>/dev/null || true
mv absolut_purge.js add_simulators_translation.js fix.js refactor_ui.js _PAPERERA_OBSOLETA/ 2>/dev/null || true

# Logs to AUDITORIES
mv build_error*.log build_output.log lint_*.txt found.txt grep_author.txt mensaje_qwen*.txt _AUDITORIES/ 2>/dev/null || true
mv ProfileView_Codi_Actiu.txt los_tres_nucleos.txt temp_mcp/ temp_tools/ _AUDITORIES/ 2>/dev/null || true
mv [LOG]*\.md _AUDITORIES/ 2>/dev/null || true
mv AUDIT_REPORT_FINAL.md _AUDITORIES/ 2>/dev/null || true

# SQL migrations, scripts and backups to HISTORIC_SENSIBLE
mv supa_omega*.sql supa_purge_*.sql supa_seeds*.sql supa_sanitization.sql supabase_indices.sql supabase_security_fixes.sql migration_REPAIR*.sql _HISTORIC_SENSIBLE/ 2>/dev/null || true
mv *.tar.gz *.zip _HISTORIC_SENSIBLE/ 2>/dev/null || true

# CJS migrations and utilities to HISTORIC_SENSIBLE
mv audit-data.cjs check_data.cjs dump_context.cjs fix-commas.cjs fix_architecture.cjs fix_data.cjs fix_imports.cjs fix_missing_images.cjs _HISTORIC_SENSIBLE/ 2>/dev/null || true
mv inject-*.cjs replace_ghosts.cjs recover.cjs _HISTORIC_SENSIBLE/ 2>/dev/null || true
mv combine_presentation.mjs patch_feed.js patch_feed.mjs patch_unclassified.js _HISTORIC_SENSIBLE/ 2>/dev/null || true
mv restore_masterpiece.js restore_register.js sync_posts_*.js update_*.js _HISTORIC_SENSIBLE/ 2>/dev/null || true
mv force_fix_*.js purge_ghosts.js purge-ghosts.sh count_posts.js generate_*.js generate_*.py find_javi.js _HISTORIC_SENSIBLE/ 2>/dev/null || true

# Markdowns and presentations to DOCUMENTACIO_OFICIAL
mv libro_*.md MANUAL_DE_MARCA_PREMIUM.html OFFICIAL_F97933_NANDO.html ANNEX_DOMICILIACIO_NANDO.html _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv PRESENTACIO_BETA_SOLUTIA.pdf DOSSIER_NANDO_XYLELLA.md MARKETING_PLAN_RURAL_TECH.md _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv TECHNICAL_REPORT_*.md migration_plan.md SEO_Redirect_Map.md SEED_MANIFEST.md _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv ESTRUCTURA_GIT.md GENETICS.md CODEX_INIT.md SOBIRANIA.md _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv README_ChatGPT_Auditor.md creador-de-skills-antigravity.md _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv soc_de_poble_*.html store_assets.html _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv header_screenshot.png _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true
mv ideas_fase_7_p2p.md _DOCUMENTACIO_OFICIAL/ 2>/dev/null || true

# Miscellaneous scripts
mv DEPLOY_*.sh EXPORT_CORE.sh install.sh replace_prompt_code.sh ENVS_*.sh _HISTORIC_SENSIBLE/ 2>/dev/null || true
mv test_phar.php test_osm.js test_models.mjs _PAPERERA_OBSOLETA/ 2>/dev/null || true
mv GENESIS_ENGINE.py _HISTORIC_SENSIBLE/ 2>/dev/null || true

echo "Done archiving"
