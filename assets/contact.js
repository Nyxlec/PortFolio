/**
 * Formulaire de contact — envoi vers Supabase
 * - Honeypot anti-bot
 * - Rate limiting client (3 envois max / heure / navigateur)
 * - Validation client + serveur (RLS + checks SQL)
 */
(function(){
  "use strict";

  const form = document.getElementById("contactForm");
  if(!form) return;

  const cfg = window.SUPABASE_CONFIG || {};
  const isConfigured = cfg.url && cfg.anonKey
    && !cfg.url.startsWith("REPLACE_") && !cfg.anonKey.startsWith("REPLACE_");

  const fields = {
    name:    document.getElementById("cfName"),
    email:   document.getElementById("cfEmail"),
    subject: document.getElementById("cfSubject"),
    body:    document.getElementById("cfBody"),
    hp:      document.getElementById("cfHoneypot"),
    counter: document.getElementById("cfCounter"),
    submit:  document.getElementById("cfSubmit"),
    status:  document.getElementById("cfStatus")
  };

  // Compteur live
  fields.body.addEventListener("input", () => {
    const len = fields.body.value.length;
    fields.counter.textContent = len + " / 5000";
  });

  function setStatus(type, msg){
    fields.status.className = "form-status " + type;
    fields.status.textContent = msg;
  }

  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // Rate limit côté client (anti-spam basique en mémoire)
  // La vraie protection vient des checks SQL côté Supabase.
  const RL_MAX = 3;          // 3 envois max
  const RL_WINDOW = 3600e3;  // par heure
  let rlTimestamps = [];
  function rateLimitOk(){
    const now = Date.now();
    rlTimestamps = rlTimestamps.filter(t => now - t < RL_WINDOW);
    if(rlTimestamps.length >= RL_MAX) return false;
    rlTimestamps.push(now);
    return true;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", "");

    // 1. Honeypot
    if(fields.hp.value.trim() !== ""){
      // bot détecté — on simule un succès pour ne pas l'alerter
      setStatus("ok", "Message envoyé. Merci, je reviens vers vous rapidement.");
      form.reset();
      return;
    }

    // 2. Validation
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value.trim();
    const body = fields.body.value.trim();

    if(!name || name.length < 2){
      setStatus("err", "Merci d'indiquer votre nom.");
      fields.name.focus(); return;
    }
    if(!validEmail(email)){
      setStatus("err", "Adresse email invalide.");
      fields.email.focus(); return;
    }
    if(!body || body.length < 10){
      setStatus("err", "Le message doit contenir au moins 10 caractères.");
      fields.body.focus(); return;
    }
    if(body.length > 5000){
      setStatus("err", "Message trop long (max 5000 caractères).");
      return;
    }

    // 3. Rate limit
    if(!rateLimitOk()){
      setStatus("err", "Trop d'envois récents. Merci de réessayer plus tard.");
      return;
    }

    // 4. Configuration Supabase présente ?
    if(!isConfigured){
      setStatus("err", "Le formulaire n'est pas encore configuré. Merci d'envoyer un email directement à dorianlecomtepro@gmail.com.");
      return;
    }

    // 5. Envoi
    fields.submit.disabled = true;
    setStatus("loading", "Envoi en cours…");

    try {
      const client = window.supabase.createClient(cfg.url, cfg.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const { error } = await client.from("messages").insert([{
        name, email,
        subject: subject || null,
        body,
        user_agent: navigator.userAgent.substring(0, 300)
      }]);
      if(error) throw error;

      setStatus("ok", "Message envoyé. Merci, je reviens vers vous rapidement.");
      form.reset();
      fields.counter.textContent = "0 / 5000";
    } catch(err){
      console.error(err);
      setStatus("err", "Erreur lors de l'envoi. Merci de réessayer ou d'écrire directement à dorianlecomtepro@gmail.com.");
    } finally {
      fields.submit.disabled = false;
    }
  });
})();
