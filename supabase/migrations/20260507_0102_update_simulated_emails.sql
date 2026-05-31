-- Migration: Update simulated entity emails to a standard fictitious email
-- Date: 2026-05-07

UPDATE public.entities
SET contact_email = 'soc-una-ia-i-estic-al-xat@socdepoble.org'
WHERE is_real = false;
