/* =========================================================
   Dorian Lecomte — Portfolio v2 · CONFIG global
   Modifier ce fichier suffit à mettre à jour tout le site.
   ========================================================= */

const CONFIG = {
  identity: {
    name: "Dorian Lecomte",
    initials: "DL",
    title: "Ingénieur en Sciences du Numérique, Réseaux, Systèmes & Cybersécurité",
    statusLine: "Disponible · Stage / Opportunités",
    location: "France · Mobilité ouverte",
    email: "dorianlecomtepro@gmail.com",
  },

  links: {
    github:    "https://github.com/Nyxlec",
    linkedin:  "https://www.linkedin.com/in/dorian-lecomte-ab5159347/",
    tryhackme: "https://tryhackme.com/p/NyxLec",
    htb:       "https://app.hackthebox.com/users/2685592",
    cv:        "#", // remplacer par le PDF du CV plus tard
  },

  /* -------------------- Parcours -------------------- */
  parcours: [
    {
      period: "2024 — 2026",
      title: "Cycle préparatoire intégré · 2ᵉ année",
      org: "CESI École d'Ingénieurs · Mineure Informatique",
      desc: "Mathématiques, algorithmique, programmation, méthodologie projet, communication. Préparation au cycle ingénieur orienté Sciences du Numérique, Réseaux, Systèmes d'Information et Cybersécurité.",
      tags: ["Mathématiques","Algorithmique","C / C++","Python","Réseaux","Méthodologie projet"],
    },
    {
      period: "2026 — 2030",
      title: "Cycle ingénieur · Sciences du Numérique, Réseaux & Cybersécurité (cible)",
      org: "CESI École d'Ingénieurs",
      desc: "Spécialisation visée : architectures réseaux, systèmes d'information, sécurité défensive et offensive, gouvernance et conformité.",
      tags: ["Cybersécurité","Réseaux","Systèmes","Cloud","Gouvernance"],
    },
    {
      period: "2024",
      title: "Baccalauréat général",
      org: "Spécialités scientifiques",
      desc: "Obtention du baccalauréat général avec spécialités à orientation scientifique, base solide pour l'entrée en classe préparatoire intégrée.",
      tags: ["Mathématiques","Physique","Sciences"],
    },
  ],

  /* -------------------- Cyber lab -------------------- */
  thm: {
    handle: "@NyxLec",
    flag: "Top 5%",
    stats: [
      { k: "Rang",       v: "100 012",  sub: "top 5%" },
      { k: "Niveau",     v: "50",       sub: "0x9 · MAGE" },
      { k: "Rooms",      v: "73",       sub: "complétées" },
      { k: "Badges",     v: "12",       sub: "obtenus" },
      { k: "Streak",     v: "2",        sub: "jours" },
      { k: "Pays",       v: "FR",       sub: "Student" },
    ],
  },
  htb: {
    handle: "Profil HTB",
    flag: "En cours",
    flagTone: "warn",
    stats: [
      { k: "Rang",      v: "—", sub: "à venir" },
      { k: "Machines",  v: "—", sub: "rooted" },
      { k: "Challenges",v: "—", sub: "résolus" },
      { k: "Académie",  v: "•", sub: "modules en cours" },
      { k: "Niveau",    v: "—", sub: "—" },
      { k: "Saison",    v: "—", sub: "—" },
    ],
  },

  /* Certifications plateformes (déplacées du bloc Diplômes vers Cyber lab) */
  platformsCerts: [
    {
      name: "Introduction to Cybersecurity",
      issuer: "Cisco Networking Academy",
      status: "Obtenue",
      tone: "ok",
      when: "2024",
      url: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity",
      tags: ["Fondamentaux","Cybersécurité"],
    },
    {
      name: "TryHackMe — Badges & rooms (12 badges, 73 rooms)",
      issuer: "TryHackMe",
      status: "En cours",
      tone: "neutral",
      when: "Continu",
      url: "https://tryhackme.com/p/NyxLec",
      tags: ["Pentest","Defensive","Linux","Networking"],
    },
    {
      name: "HTB Academy — Modules de fondamentaux",
      issuer: "Hack The Box Academy",
      status: "En cours",
      tone: "neutral",
      when: "Continu",
      url: "https://academy.hackthebox.com/",
      tags: ["Pentest","Réseaux","Systèmes"],
    },
  ],

  /* -------------------- Diplômes & Certifications -------------------- */
  diplomes: [
    {
      name: "Baccalauréat général",
      issuer: "Spécialités scientifiques",
      status: "Obtenu",
      tone: "ok",
      when: "2024",
      url: null,
      tags: ["Sciences","Mathématiques"],
    },
    {
      name: "Diplôme d'ingénieur — Sciences du Numérique, Réseaux & Cybersécurité",
      issuer: "CESI École d'Ingénieurs",
      status: "En cours",
      tone: "neutral",
      when: "Cible 2030",
      url: null,
      tags: ["Ingénieur","Cybersécurité"],
    },
  ],

  certifications: {
    network: [
      {
        name: "CCNA 1 — Introduction to Networks",
        issuer: "Cisco Networking Academy",
        status: "Obtenue",
        tone: "ok",
        when: "2024",
        url: "https://www.credly.com/badges/5e21f5af-f9d4-4d88-97e5-456bb171808f",
        tags: ["Réseaux","TCP/IP","Switching"],
      },
      {
        name: "CCNA 2 — Switching, Routing & Wireless Essentials",
        issuer: "Cisco Networking Academy",
        status: "Planifiée",
        tone: "todo",
        when: "Prochain semestre",
        url: null,
        tags: ["Routage","VLAN","Wi-Fi"],
      },
      {
        name: "ITIL Foundation",
        issuer: "AXELOS / PeopleCert",
        status: "Planifiée",
        tone: "todo",
        when: "Cycle ingénieur",
        url: null,
        tags: ["ITSM","Gouvernance"],
      },
    ],
    code: [
      {
        name: "Python Essentials 1",
        issuer: "Cisco Networking Academy",
        status: "Obtenue",
        tone: "ok",
        when: "2024",
        url: "https://www.netacad.com/courses/programming/python-essentials-1",
        tags: ["Python","Algorithmique"],
      },
      {
        name: "C++ Essentials 1",
        issuer: "Cisco Networking Academy",
        status: "Obtenue",
        tone: "ok",
        when: "2025",
        url: "https://www.netacad.com/courses/programming/cpp-essentials-1",
        tags: ["C++","POO"],
      },
    ],
    gov: [
      {
        name: "Atelier RGPD — 6 MOOC CNIL",
        issuer: "CNIL",
        status: "Obtenue",
        tone: "ok",
        when: "2024",
        url: "https://atelier-rgpd.cnil.fr",
        tags: ["RGPD","Conformité","Données personnelles"],
      },
    ],
  },

  /* -------------------- Projets -------------------- */
  projects: {
    perso: [
      {
        title: "Lab pentest personnel",
        kind: "Sécurité offensive",
        when: "Continu",
        desc: "Environnement local pour expérimenter reconnaissance, exploitation et post-exploitation. Cibles vulnérables, captures et notes structurées.",
        stack: ["Kali Linux","Nmap","Burp Suite","Metasploit","Wireshark"],
        url: null,
      },
      {
        title: "Portfolio web",
        kind: "Web · Personnel",
        when: "2026",
        desc: "Ce site, conçu et développé sans framework. Design system maison, dark only, accent cyan, structure éditoriale type tableau de bord.",
        stack: ["HTML","CSS","JavaScript","Git"],
        url: "https://github.com/Nyxlec",
      },
      {
        title: "Veille cyber automatisée (interne)",
        kind: "Outils · Personnel",
        when: "2025",
        desc: "Petits scripts Python pour collecter et trier des sources de veille (CERT-FR, vulnérabilités, threat intel). Usage privé pour structurer ma curiosité.",
        stack: ["Python","RSS","Cron","Linux"],
        url: null,
      },
    ],
    acad: [
      {
        slug: "funkytown",
        title: "FunkyTown — Architecture réseau multi-sites",
        kind: "Réseaux · CESI",
        when: "2ᵉ année",
        desc: "Conception d'une architecture réseau pour entreprise multi-sites avec VLAN, routage inter-VLAN, ACL et VPN site-à-site, simulée sous Cisco Packet Tracer.",
        stack: ["Cisco Packet Tracer","VLAN","Routage","ACL","VPN"],
      },
      {
        slug: "airdata",
        title: "AirData — Base de données qualité de l'air",
        kind: "BDD · CESI",
        when: "2ᵉ année",
        desc: "Modélisation et implémentation d'une base de données relationnelle pour exploiter les données de qualité de l'air : MCD, MLD, requêtes SQL et exploitation.",
        stack: ["MySQL","Looping","SQL","MCD/MLD"],
      },
      {
        slug: "strongbox",
        title: "StrongBox 3000 — Authentification multi-facteurs embarquée",
        kind: "Embarqué · CESI",
        when: "1ʳᵉ / 2ᵉ année",
        desc: "Système embarqué d'authentification multi-facteurs avec capteurs et chiffrement, programmé en C sur Arduino. Travail en équipe avec démarche projet structurée.",
        stack: ["Arduino","C","Cryptographie","Capteurs"],
      },
      {
        slug: "worldwide",
        title: "Worldwide Weather Watcher — Station météo embarquée",
        kind: "Embarqué · CESI",
        when: "1ʳᵉ année",
        desc: "Station météo autonome construite sur Arduino : capteurs température/humidité/pression, journalisation sur carte SD et restitution lisible.",
        stack: ["Arduino","C","Capteurs","SD"],
      },
      {
        slug: "game-of-life",
        title: "Conway's Game of Life — POO C++",
        kind: "Programmation · CESI",
        when: "2ᵉ année",
        desc: "Implémentation orientée objet du Jeu de la Vie en C++, avec rendu graphique SFML, structuration en classes et gestion de versions.",
        stack: ["C++","SFML","Visual Studio","Git"],
        url: "https://github.com/Nyxlec/Jeu_de_la_vie",
      },
    ],
  },
};

window.CONFIG = CONFIG;
