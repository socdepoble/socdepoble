> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_DOCUMENTACIO_OFICIAL/migration_plan.md`

# 📦 Pla de Migració de Continguts (30 Anys)

## Objectiu
Migrar tot l'històric de publicacions de "Sóc de Poble" i "El Rentonar" a la nova plataforma, mantenint autoria, dades i imatges.

## Fonts de Dades
1.  **Sóc de Poble:** `https://socdepoble.net` (Wordpress / HTML)
2.  **El Rentonar:** `https://socdepoble.net/category/el-rentonar/` (o blog extern si es confirma)
    *   *Nota:* Sembla que "El Rentonar" ja està integrat com a categoria dins de socepoble.net. Això facilita la migració (una sola font).

## Estratègia Tècnica

### 1. Extracció (Scraping)
Crearem un script `scripts/migrate_content.js` que:
*   Recorrerà totes les pàgines (paginació) de `socdepoble.net`.
*   Extraurà: Títol, Data, Autor, Contingut HTML, Imatges Destacades i **Etiquetes (Tags)**.
*   Detectarà la categoria: Si és "Rentonar", assignarà a l'Entitat "El Rentonar". Si no, a "Sóc de Poble".

### 2. Processament d'Imatges
*   Descarregar totes les imatges trobades.
*   Pujar-les a Supabase Storage (bucket `posts`).
*   Substituir els enllaços `src="..."` de l'HTML original pels nous enllaços de Supabase.

### 3. Deduplicació
*   Utilitzarem el Títol i la Data per detectar duplicats.
*   Si una notícia existeix en els dos llocs (si fossin fonts separades), es crearà una única entrada amb co-autoria o es prioritzarà l'entitat principal.

### 4. Inserció a Base de Dades
*   Taula `posts`.
*   Autor: Assignar a l'usuari `socdepoble` (Javi).
*   Entitat: Assignar a l'Entitat corresponent (UUID de Sóc de Poble o Rentonar).
*   Data: Respectar `created_at` original.

## Passos Immediats (Per a la propera sessió)
1.  **Executar SQL:** `create_rentonar_entity.sql` (Usuari).
2.  **Validar Script:** Executar prova pilot amb les 10 últimes notícies.
3.  **Aprovació:** Verificar que es veuen bé al mur ("Card expandida").
4.  **Execució Massiva:** Migrar els 30 anys.

## UI Requirements
*   [ ] Crear vista de "Detall de Post" (Pantalla completa / Modal gran) per llegir articles llargs.
