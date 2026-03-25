-- 08_PURGA_ANTI_LIKES_I_FANTASMES.sql
-- Script de Neteja Extrema i Auditoria de Trellat (Codex)
-- 
-- Aquest script DESTROSSARÀ irreversiblement totes les taules fantasma
-- que l'aplicació ja no usa ni coneix i que embruten l'arquitectura.

BEGIN;

-- 1. Purga de la aberració capitalista dels "ikes"
DROP TABLE IF EXISTS "public"."post_likes" CASCADE;

-- 2. Eliminació d'estructures de xat obsoletes que van ser substituïdes per 'conversations' i 'messages'
DROP TABLE IF EXISTS "public"."legacy_messages" CASCADE;
DROP TABLE IF EXISTS "public"."legacy_chats" CASCADE;

-- 3. Eliminació d'un vestigi no utilitzat de les etiquetes de connexió
DROP TABLE IF EXISTS "public"."connection_tags" CASCADE;

COMMIT;

-- Nota: Recorda eliminar qualsevol Storage Bucket antic anomenat 'avatars_legacy' si existix en el futur.
