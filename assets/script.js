/* =========================================================
   Dorian Lecomte — Portfolio v2 · Script
   Render-only. Dark only. Pas de toggle thème.
   ========================================================= */

(function(){
  "use strict";
  const C = window.CONFIG || {};

  /* ---------- helpers ---------- */
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, attrs={}, ...children) => {
    const node = document.createElement(tag);
    for(const [k,v] of Object.entries(attrs||{})){
      if(k === "class") node.className = v;
      else if(k === "html") node.innerHTML = v;
      else if(k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if(v === true) node.setAttribute(k,"");
      else if(v === false || v == null) {/* skip */}
      else node.setAttribute(k, v);
    }
    for(const c of children.flat()){
      if(c == null || c === false) continue;
      node.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return node;
  };
  const escapeHtml = (s) => String(s ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  const toneStatus = (tone) => tone === "ok" ? "" :
                               tone === "todo" ? "todo" :
                               "neutral";

  /* ---------- identity ---------- */
  const setText = (id, txt) => { const n = document.getElementById(id); if(n) n.textContent = txt; };
  const setHref = (id, href) => { const n = document.getElementById(id); if(n && href) n.setAttribute("href", href); };

  if(C.identity){
    setText("brandInitials", C.identity.initials || "DL");
    setText("brandName",     C.identity.name || "");
    setText("heroName",      C.identity.name || "");
    setText("sNom",          C.identity.name || "");
    setText("sLoc",          C.identity.location || "");
    setText("availabilityLine", C.identity.statusLine || "");
  }
  if(C.links){
    setHref("ghLink",        C.links.github);
    setHref("liLink",        C.links.linkedin);
    setHref("thmLink",       C.links.tryhackme);
    setHref("htbLink",       C.links.htb);
    setHref("thmCardLink",   C.links.tryhackme);
    setHref("htbCardLink",   C.links.htb);
    setHref("thmFootLink",   C.links.tryhackme);
    setHref("htbFootLink",   C.links.htb);
    setHref("contactLi",     C.links.linkedin);
    setHref("contactGh",     C.links.github);
    setHref("cLi",           C.links.linkedin);
    setHref("cGh",           C.links.github);
    setHref("cThm",          C.links.tryhackme);
    setHref("cHtb",          C.links.htb);
    if(C.links.cv) setHref("cvLink", C.links.cv);
  }
  if(C.identity?.email){
    const mail = C.identity.email;
    const m = document.getElementById("contactMail");
    if(m) m.setAttribute("href", `mailto:${mail}`);
    const e = document.getElementById("cEmail");
    if(e){ e.setAttribute("href", `mailto:${mail}`); e.textContent = mail; }
  }

  /* ---------- last sync timestamp ---------- */
  const ls = document.getElementById("lastUpdate");
  if(ls){
    const d = new Date();
    const pad = (n) => String(n).padStart(2,"0");
    ls.textContent = `last_sync · ${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  const yr = document.getElementById("year");
  if(yr) yr.textContent = new Date().getFullYear();

  /* ---------- BACKGROUND animated network particles ---------- */
  (function animateBgNet(){
    const canvas = document.getElementById("bgCanvas");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ACCENT = "94,230,208"; // var(--accent) en rgb
    let W = 0, H = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const nodes = [];
    const NCOUNT = () => {
      // Adapter densité à la largeur — viser ~1 nœud pour 14000 px²
      const target = Math.round((W * H) / 14000);
      return Math.max(28, Math.min(70, target));
    };
    const LINK_DIST = () => Math.min(180, Math.max(110, W * 0.10));

    function resize(){
      W = Math.max(1, Math.floor(window.innerWidth));
      H = Math.max(1, Math.floor(window.innerHeight));
      canvas.width  = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      seed();
    }
    function seed(){
      nodes.length = 0;
      const N = NCOUNT();
      for(let i=0;i<N;i++){
        nodes.push({
          x: Math.random()*W,
          y: Math.random()*H,
          vx: (Math.random()*2-1) * 0.18,
          vy: (Math.random()*2-1) * 0.18,
          r: 1.2 + Math.random()*1.0,
          a: 0.35 + Math.random()*0.5,
          phase: Math.random()*Math.PI*2,
        });
      }
    }

    let mouse = { x: -9999, y: -9999, active: false };
    window.addEventListener("mouseleave", ()=>{ mouse.active = false; });
    window.addEventListener("mousemove", (e)=>{
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    }, { passive: true });

    let last = performance.now();
    let running = true;

    function frame(t){
      if(!running) return;
      const dt = Math.min(40, t - last); last = t;
      const dts = dt / 16.667; // step normalisé sur 60fps
      ctx.clearRect(0,0,W,H);

      const Dlink = LINK_DIST();

      // mise à jour positions
      for(let i=0;i<nodes.length;i++){
        const p = nodes[i];
        p.phase += 0.004 * dts;
        // dérive douce avec léger sinus pour vie organique
        p.x += (p.vx + Math.cos(p.phase) * 0.04) * dts;
        p.y += (p.vy + Math.sin(p.phase) * 0.04) * dts;
        // rebords doux (rebond)
        if(p.x < -8){ p.x = -8; p.vx = Math.abs(p.vx); }
        if(p.x > W+8){ p.x = W+8; p.vx = -Math.abs(p.vx); }
        if(p.y < -8){ p.y = -8; p.vy = Math.abs(p.vy); }
        if(p.y > H+8){ p.y = H+8; p.vy = -Math.abs(p.vy); }
      }

      // liens entre nœuds proches
      ctx.lineWidth = 0.7;
      for(let i=0;i<nodes.length;i++){
        const a = nodes[i];
        for(let j=i+1;j<nodes.length;j++){
          const b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d2 = dx*dx + dy*dy;
          if(d2 < Dlink*Dlink){
            const d = Math.sqrt(d2);
            const alpha = (1 - d/Dlink) * 0.45;
            ctx.strokeStyle = `rgba(${ACCENT},${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // lien à la souris (subtil)
      if(mouse.active){
        const Dm = Dlink * 1.1;
        for(let i=0;i<nodes.length;i++){
          const p = nodes[i];
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx*dx + dy*dy;
          if(d2 < Dm*Dm){
            const d = Math.sqrt(d2);
            const alpha = (1 - d/Dm) * 0.55;
            ctx.strokeStyle = `rgba(${ACCENT},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // nœuds
      for(let i=0;i<nodes.length;i++){
        const p = nodes[i];
        const pulse = 0.85 + Math.sin(p.phase*2) * 0.15;
        ctx.fillStyle = `rgba(${ACCENT},${(p.a * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }

      requestAnimationFrame(frame);
    }

    function drawStatic(){
      // rendu statique unique pour reduced motion
      ctx.clearRect(0,0,W,H);
      const Dlink = LINK_DIST();
      ctx.lineWidth = 0.7;
      for(let i=0;i<nodes.length;i++){
        const a = nodes[i];
        for(let j=i+1;j<nodes.length;j++){
          const b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const d2 = dx*dx + dy*dy;
          if(d2 < Dlink*Dlink){
            const d = Math.sqrt(d2);
            const alpha = (1 - d/Dlink) * 0.4;
            ctx.strokeStyle = `rgba(${ACCENT},${alpha.toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      for(let i=0;i<nodes.length;i++){
        const p = nodes[i];
        ctx.fillStyle = `rgba(${ACCENT},${p.a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      }
    }

    // pause si onglet en arrière-plan
    document.addEventListener("visibilitychange", ()=>{
      if(document.hidden){
        running = false;
      } else if(!reduceMotion){
        if(!running){ running = true; last = performance.now(); requestAnimationFrame(frame); }
      }
    });

    let resizeT = null;
    window.addEventListener("resize", ()=>{
      clearTimeout(resizeT);
      resizeT = setTimeout(()=>{ resize(); if(reduceMotion) drawStatic(); }, 120);
    });

    resize();
    if(reduceMotion){
      drawStatic();
    } else {
      requestAnimationFrame(frame);
    }
  })();

  /* ---------- Parcours timeline ---------- */
  const tl = document.getElementById("timeline");
  if(tl && Array.isArray(C.parcours)){
    C.parcours.forEach(item=>{
      const node = el("article", {class:"tl-item reveal", role:"listitem"},
        el("div",{class:"tl-head"},
          el("div",{class:"tl-title"}, item.title || ""),
          el("div",{class:"tl-period"}, item.period || ""),
        ),
        el("div",{class:"tl-org"}, item.org || ""),
        el("p",{class:"tl-desc"}, item.desc || ""),
        item.tags?.length ? el("div",{class:"tl-tags"},
          ...item.tags.map(t=>el("span",{class:"chip"}, t))
        ) : null
      );
      tl.appendChild(node);
    });
  }

  /* ---------- Cyber lab : stats + flag ---------- */
  function renderStats(containerId, stats){
    const wrap = document.getElementById(containerId);
    if(!wrap) return;
    wrap.innerHTML = "";
    (stats||[]).forEach(s=>{
      wrap.appendChild(
        el("div",{class:"stat"},
          el("span",{class:"stat-k"}, s.k || ""),
          el("span",{class:"stat-v"}, s.v ?? "—"),
          el("span",{class:"stat-sub"}, s.sub || ""),
        )
      );
    });
  }
  if(C.thm){
    setText("thmHandle", C.thm.handle || "@NyxLec");
    const flag = document.getElementById("thmFlag");
    if(flag){ flag.textContent = C.thm.flag || ""; if(C.thm.flagTone) flag.dataset.tone = C.thm.flagTone; }
    renderStats("thmStats", C.thm.stats);
  }
  if(C.htb){
    setText("htbHandle", C.htb.handle || "@NyxLec");
    const flag = document.getElementById("htbFlag");
    if(flag){ flag.textContent = C.htb.flag || ""; if(C.htb.flagTone) flag.dataset.tone = C.htb.flagTone; }
    renderStats("htbStats", C.htb.stats);
  }

  /* ---------- Cert card factory ---------- */
  function certCard(c){
    const status = el("span",
      Object.assign({class:"cert-status"}, c.tone && c.tone !== "ok" ? {"data-tone": toneStatus(c.tone)} : {}),
      c.status || ""
    );
    const top = el("div",{class:"cert-top"},
      el("div",{},
        el("div",{class:"cert-name"}, c.name || ""),
        el("div",{class:"cert-issuer"}, c.issuer || ""),
      ),
      status
    );
    const meta = c.tags?.length
      ? el("div",{class:"cert-meta"}, ...c.tags.map(t=>el("span",{class:"chip"}, t)))
      : null;
    const foot = el("div",{class:"cert-foot"},
      el("span",{class:"when"}, c.when || ""),
      c.url
        ? el("a",{class:"verify", href:c.url, target:"_blank", rel:"noopener", html:`Voir <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>`})
        : el("span",{class:"verify muted"}, "—")
    );
    return el("article",{class:"cert reveal"}, top, meta, foot);
  }
  function fillCertGrid(id, list){
    const grid = document.getElementById(id);
    if(!grid) return;
    grid.innerHTML = "";
    (list||[]).forEach(c=> grid.appendChild(certCard(c)) );
  }

  fillCertGrid("certPlatformsGrid", C.platformsCerts);
  fillCertGrid("diplomesGrid",      C.diplomes);
  fillCertGrid("certNetGrid",       C.certifications?.network);
  fillCertGrid("certCodeGrid",      C.certifications?.code);
  fillCertGrid("certGovGrid",       C.certifications?.gov);

  /* ---------- Projets ---------- */
  function projectCard(p, opts={}){
    const head = el("div",{class:"head"},
      el("div",{},
        el("div",{class:"num"}, opts.num || ""),
        el("h3",{}, p.title || ""),
      ),
      el("span",{class:"kind"}, p.kind || ""),
    );
    const stack = p.stack?.length
      ? el("div",{class:"stack"}, ...p.stack.map(s=>el("span",{class:"chip"}, s)))
      : null;
    const footChildren = [
      el("span",{class:"when"}, p.when || ""),
    ];
    if(opts.detailHref){
      footChildren.push(
        el("a",{class:"btn-more", href:opts.detailHref}, "En savoir plus →")
      );
    } else if(p.url){
      footChildren.push(
        el("a",{class:"btn-more", href:p.url, target:"_blank", rel:"noopener"}, "Voir le repo ↗")
      );
    } else {
      footChildren.push(el("span",{class:"mono muted"}, "—"));
    }
    const foot = el("div",{class:"foot"}, ...footChildren);
    return el("article",{class:"project reveal"},
      head,
      el("p",{class:"desc"}, p.desc || ""),
      stack,
      foot
    );
  }
  const persoWrap = document.getElementById("projPerso");
  const acadWrap  = document.getElementById("projAcad");
  const persoList = C.projects?.perso || [];
  const acadList  = C.projects?.acad || [];
  if(persoWrap){
    persoList.forEach((p,i)=> persoWrap.appendChild(projectCard(p, { num: `// ${String(i+1).padStart(2,"0")}` })) );
  }
  if(acadWrap){
    acadList.forEach((p,i)=> acadWrap.appendChild(projectCard(p, {
      num: `// ${String(i+1).padStart(2,"0")}`,
      detailHref: p.slug ? `projets/${p.slug}.html` : null
    })) );
  }
  setText("countPerso", `·${persoList.length}`);
  setText("countAcad",  `·${acadList.length}`);

  // tab switching
  $$(".proj-tabs button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const tab = btn.dataset.tab;
      $$(".proj-tabs button").forEach(b=>b.classList.toggle("active", b===btn));
      if(persoWrap) persoWrap.hidden = (tab !== "perso");
      if(acadWrap)  acadWrap.hidden  = (tab !== "acad");
    });
  });

  /* ---------- Mobile drawer ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const drawer  = document.getElementById("drawer");
  if(menuBtn && drawer){
    menuBtn.addEventListener("click", ()=>{
      const open = drawer.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-hidden", String(!open));
    });
    drawer.querySelectorAll("a").forEach(a=>{
      a.addEventListener("click", ()=>{
        drawer.classList.remove("open");
        menuBtn.setAttribute("aria-expanded","false");
        drawer.setAttribute("aria-hidden","true");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, {rootMargin:"0px 0px -10% 0px", threshold:0.05});
    $$(".reveal").forEach(n=>io.observe(n));
  } else {
    $$(".reveal").forEach(n=>n.classList.add("in"));
  }

  /* ---------- Build hash (purely cosmetic) ---------- */
  const bh = document.getElementById("buildHash");
  if(bh){
    const seed = (C.identity?.name || "DL") + new Date().toDateString();
    let h = 0; for(const ch of seed){ h = (h*31 + ch.charCodeAt(0)) & 0xffffff; }
    bh.textContent = h.toString(16).padStart(6,"0") + "-stable";
  }
})();
