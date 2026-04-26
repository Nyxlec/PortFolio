/**
 * Configuration Supabase
 *
 * IMPORTANT — Sécurité :
 * - SUPABASE_URL et SUPABASE_ANON_KEY sont des valeurs PUBLIQUES par design.
 *   Elles sont conçues pour être exposées dans le code client.
 * - La sécurité repose sur les Row Level Security (RLS) policies définies
 *   côté Supabase, PAS sur la confidentialité de ces clés.
 * - Le mot de passe admin n'est JAMAIS stocké ici. Il est géré entièrement
 *   par Supabase Auth (hashé bcrypt côté serveur Supabase).
 */
window.SUPABASE_CONFIG = {
  url: "https://acouzfqohjsquznzufqk.supabase.co",
  anonKey: "sb_publishable_aoO9VguFzUAL_WCTz1nlYQ_tdEqKBDO"
};
