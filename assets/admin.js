/**
 * Admin console — Supabase Auth + lecture/gestion des messages.
 *
 * Sécurité :
 * - Aucune donnée sensible dans le code (URL/anonKey publiques par design).
 * - Le mot de passe admin n'est jamais ici, géré par Supabase Auth.
 * - Les messages ne sont chargés qu'APRÈS authentification réussie
 *   → un curl sur cette page ne renvoie rien d'intéressant.
 * - RLS Supabase empêche toute lecture sans token JWT valide.
 */
(function(){
  "use strict";

  const cfg = window.SUPABASE_CONFIG || {};
  const isConfigured = cfg.url && cfg.anonKey
    && !cfg.url.startsWith("REPLACE_") && !cfg.anonKey.startsWith("REPLACE_");

  const $ = (id) => document.getElementById(id);
  const gate = $("adminGate");
  const app = $("adminApp");
  const loginForm = $("loginForm");
  const loginEmail = $("loginEmail");
  const loginPassword = $("loginPassword");
  const loginBtn = $("loginBtn");
  const loginStatus = $("loginStatus");

  let client = null;
  let currentUser = null;
  let messages = [];      // tous les messages
  let selectedId = null;
  let filter = "all";
  let searchQ = "";

  function setLoginStatus(type, msg){
    loginStatus.className = "form-status " + type;
    loginStatus.textContent = msg;
  }

  function showApp(){
    gate.style.display = "none";
    app.hidden = false;
    $("adminUser").textContent = currentUser?.email || "";
  }
  function showGate(){
    app.hidden = true;
    gate.style.display = "";
  }

  // --- Init ---
  if(!isConfigured){
    setLoginStatus("err", "Configuration Supabase manquante. Voir SUPABASE_SETUP.sql et supabase-config.js.");
    loginBtn.disabled = true;
    return;
  }

  // Pas de persistance de session : l'utilisateur se reconnecte à chaque visite.
  // C'est plus sûr (pas de token JWT en clair dans le navigateur à long terme).
  client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false }
  });

  // --- Login ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoginStatus("loading", "Vérification…");
    loginBtn.disabled = true;
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: loginEmail.value.trim(),
        password: loginPassword.value
      });
      if(error) throw error;
      currentUser = data.user;
      loginPassword.value = "";
      setLoginStatus("", "");
      showApp();
      await loadMessages();
    } catch(err){
      setLoginStatus("err", "Identifiants invalides.");
      console.warn("Auth error:", err.message);
    } finally {
      loginBtn.disabled = false;
    }
  });

  // --- Logout ---
  $("logoutBtn").addEventListener("click", async () => {
    await client.auth.signOut();
    currentUser = null;
    messages = [];
    selectedId = null;
    showGate();
    setLoginStatus("", "");
  });

  // --- Refresh ---
  $("refreshBtn").addEventListener("click", () => loadMessages());

  // --- Filter / search ---
  $("searchInput").addEventListener("input", (e) => {
    searchQ = e.target.value.toLowerCase().trim();
    renderList();
  });
  $("filterSelect").addEventListener("change", (e) => {
    filter = e.target.value;
    renderList();
  });

  // --- Load messages ---
  async function loadMessages(){
    const list = $("msgList");
    list.innerHTML = '<div class="msg-empty">Chargement…</div>';
    try {
      const { data, error } = await client
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if(error) throw error;
      messages = data || [];
      renderKpis();
      renderList();
    } catch(err){
      list.innerHTML = `<div class="msg-empty">Erreur de chargement : ${escape(err.message)}</div>`;
      console.error(err);
    }
  }

  // --- KPIs ---
  function renderKpis(){
    $("kpiTotal").textContent = messages.length;
    $("kpiUnread").textContent = messages.filter(m => !m.read).length;
    const cutoff = Date.now() - 7 * 24 * 3600e3;
    $("kpi7d").textContent = messages.filter(m => new Date(m.created_at).getTime() >= cutoff).length;
  }

  // --- List rendering ---
  function renderList(){
    const list = $("msgList");
    let arr = messages.slice();
    if(filter === "unread") arr = arr.filter(m => !m.read);
    else if(filter === "read") arr = arr.filter(m => m.read);
    if(searchQ){
      arr = arr.filter(m =>
        (m.name || "").toLowerCase().includes(searchQ) ||
        (m.email || "").toLowerCase().includes(searchQ) ||
        (m.subject || "").toLowerCase().includes(searchQ) ||
        (m.body || "").toLowerCase().includes(searchQ)
      );
    }
    if(!arr.length){
      list.innerHTML = '<div class="msg-empty">Aucun message.</div>';
      return;
    }
    list.innerHTML = arr.map(m => {
      const date = formatDate(m.created_at);
      const preview = (m.body || "").substring(0, 200);
      const cls = "msg-item" + (m.read ? "" : " unread") + (m.id === selectedId ? " active" : "");
      return `<button class="${cls}" data-id="${m.id}">
        <div class="msg-row1">
          <span class="msg-name">${escape(m.name)}</span>
          <span class="msg-date">${date}</span>
        </div>
        <div class="msg-subj">${escape(m.subject || "(sans sujet)")}</div>
        <div class="msg-preview">${escape(preview)}</div>
      </button>`;
    }).join("");

    list.querySelectorAll(".msg-item").forEach(btn => {
      btn.addEventListener("click", () => selectMessage(btn.dataset.id));
    });
  }

  // --- Detail rendering ---
  async function selectMessage(id){
    const m = messages.find(x => x.id === id);
    if(!m) return;
    selectedId = id;
    renderList();
    renderDetail(m);

    // Marquer comme lu si nécessaire
    if(!m.read){
      try {
        await client.from("messages").update({ read: true }).eq("id", id);
        m.read = true;
        renderKpis();
        renderList();
      } catch(err){ console.warn("Could not mark as read:", err); }
    }
  }

  function renderDetail(m){
    const detail = $("msgDetail");
    const date = new Date(m.created_at).toLocaleString("fr-FR", {
      dateStyle: "long", timeStyle: "short"
    });
    const mailto = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent("Re: " + (m.subject || "votre message"))}`;
    detail.innerHTML = `
      <div class="detail-head">
        <div>
          <h2>${escape(m.subject || "(sans sujet)")}</h2>
          <div class="detail-meta">
            <strong>${escape(m.name)}</strong> · <a href="mailto:${escape(m.email)}">${escape(m.email)}</a><br/>
            ${escape(date)}
          </div>
        </div>
        <div class="detail-actions">
          <a class="btn primary" href="${mailto}">Répondre par email</a>
          <button class="btn" id="toggleReadBtn">${m.read ? "Marquer non lu" : "Marquer lu"}</button>
          <button class="btn danger" id="deleteBtn">Supprimer</button>
        </div>
      </div>
      <div class="detail-body">${escape(m.body || "")}</div>
      <div class="detail-tech">
        <span>// id : ${escape(m.id)}</span>
        ${m.user_agent ? `<span>// user-agent : ${escape(m.user_agent)}</span>` : ""}
      </div>
    `;
    $("toggleReadBtn").addEventListener("click", async () => {
      try {
        const newVal = !m.read;
        await client.from("messages").update({ read: newVal }).eq("id", m.id);
        m.read = newVal;
        renderKpis();
        renderList();
        renderDetail(m);
      } catch(err){ alert("Erreur : " + err.message); }
    });
    $("deleteBtn").addEventListener("click", async () => {
      if(!confirm(`Supprimer le message de ${m.name} ?`)) return;
      try {
        await client.from("messages").delete().eq("id", m.id);
        messages = messages.filter(x => x.id !== m.id);
        selectedId = null;
        renderKpis();
        renderList();
        $("msgDetail").innerHTML = `
          <div class="msg-empty-detail">
            <p class="muted">Message supprimé. Sélectionnez un autre message.</p>
          </div>`;
      } catch(err){ alert("Erreur : " + err.message); }
    });
  }

  // --- Helpers ---
  function escape(s){
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function formatDate(iso){
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if(sameDay) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const diffDays = Math.floor((now - d) / 86400e3);
    if(diffDays < 7) return d.toLocaleDateString("fr-FR", { weekday: "short" });
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  }
})();
