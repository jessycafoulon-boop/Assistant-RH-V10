/* =========================================================
   CHAT DE L'ESPACE ENCADRANTS — VERSION DE TEST
   ---------------------------------------------------------
   Chat partagé entre les encadrants ayant accès à l'espace
   managers, stocké dans Cloud Firestore (Firebase). 100%
   gratuit : ce fichier n'utilise QUE Firestore, pas Firebase
   Storage (qui nécessite le forfait payant Blaze).

   Identification : PAR MATRICULE UNIQUEMENT. Aucun nom ni
   prénom n'est jamais envoyé, stocké ou affiché — seul le
   matricule choisi apparaît à côté de chaque message.

   Phase de test : 4 matricules fictifs (10001 à 10004).
   Pour passer aux vrais matricules des encadrants, il suffira
   de remplacer TEST_MATRICULES ci-dessous ET la liste
   correspondante dans les règles de sécurité Firestore
   (rules_version 2, collection managerChat) — les deux
   listes doivent toujours être identiques.

   PAS D'UPLOAD DE FICHIER : pour partager un document ou une
   image, on colle un lien vers une ressource déjà hébergée
   ailleurs (intranet, Drive…). Les liens deviennent cliquables
   automatiquement, et un lien pointant directement vers une
   image (.jpg, .png…) s'affiche en aperçu dans la bulle.

   ⚠️ Ce fichier est chargé en tant que module ES (voir
   managers.html) car il utilise le SDK Firebase via CDN.
   La clé firebaseConfig ci-dessous est une clé "publique"
   côté client : ce n'est pas un secret, c'est la règle de
   sécurité Firestore qui protège réellement les données.
========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfJ5zauVkLWUMp5pjkAIa0gC1H7y2tDr0",
  authDomain: "chat-encadrants.firebaseapp.com",
  projectId: "chat-encadrants",
  storageBucket: "chat-encadrants.firebasestorage.app",
  messagingSenderId: "71961028015",
  appId: "1:71961028015:web:ec36ddc4e2238546d27b5a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Liste des matricules acceptés en phase de test.
   Doit rester identique à la liste dans les règles Firestore. */
const TEST_MATRICULES = ["10001", "10002", "10003", "10004"];

/* Correspondance matricule → prénom affiché dans le chat.
   Le matricule reste utilisé partout en interne (identification,
   sécurité Firestore, bulle de profil) : seul l'AFFICHAGE change,
   pour ne plus jamais montrer le matricule brut aux autres agents. */
const MATRICULE_PRENOMS = {
  "10001": "Jessyca",
  "10002": "Pierre",
  "10003": "Marie",
  "10004": "Aline"
};

function getDisplayName(matricule) {
  return MATRICULE_PRENOMS[matricule] || `Matricule ${matricule || "?"}`;
}

/* Correspondance matricule → informations locales + lien de fiche.
   AUCUN NOM N'EST STOCKÉ ICI : uniquement un service/une fonction que
   TU renseignes toi-même ci-dessous (facultatif), plus le lien vers
   la fiche intranet complète. La bulle affiche ces infos locales
   instantanément (pas de dépendance à l'intranet), avec un lien de
   secours pour ouvrir la fiche complète si besoin de vérifier
   davantage. Remplis service/fonction quand tu les as ; laisse une
   chaîne vide "" si tu ne veux pas les afficher. */
const MATRICULE_PROFILES = {
  "10001": {
    url: "https://c.conflans.mairie-conflans.fr/#!/myprofile/9b0c5e7f-0eb9-4d1a-b00d-b3d8183c23e2/About",
    service: "RH",
    fonction: "Gestionnaire formation"
  }
};

function getProfile(matricule) {
  return MATRICULE_PROFILES[matricule] || null;
}

/* Ouvre la fiche complète dans une petite fenêtre flottante séparée
   (pas une iframe intégrée) : ceci reste une vraie navigation dans
   une fenêtre à part, donc l'intranet ne peut pas la bloquer comme
   il bloquerait une iframe. */
function openProfileWindow(url) {
  const features = "width=520,height=760,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes";
  const win = window.open(url, "managerChatProfileWindow", features);
  if (win) win.focus();
}

/* =========================================================
   BULLE DE PROFIL (info locale, sans dépendance à l'intranet)
========================================================= */

let profileBubbleHandlersBound = false;

function ensureProfileBubble() {
  let bubble = document.getElementById("managerChatProfileBubble");
  if (bubble) return bubble;

  bubble = document.createElement("div");
  bubble.id = "managerChatProfileBubble";
  bubble.className = "manager-chat-profile-bubble";
  document.body.appendChild(bubble);
  return bubble;
}

function closeProfileBubble() {
  const bubble = document.getElementById("managerChatProfileBubble");
  if (bubble) bubble.classList.remove("open");
}

function openProfileBubble(trigger, matricule) {
  const profile = getProfile(matricule);
  if (!profile) return;

  const bubble = ensureProfileBubble();
  bubble.dataset.forMatricule = matricule;

  const lines = [];
  if (profile.service) lines.push(`<div class="manager-chat-profile-bubble-line"><strong>Service :</strong> ${escapeHtml(profile.service)}</div>`);
  if (profile.fonction) lines.push(`<div class="manager-chat-profile-bubble-line"><strong>Fonction :</strong> ${escapeHtml(profile.fonction)}</div>`);

  bubble.innerHTML = `
    ${lines.length > 0 ? lines.join("") : `<div class="manager-chat-profile-bubble-empty">Aucune information renseignée pour ce matricule.</div>`}
    ${profile.url ? `<button type="button" class="manager-chat-profile-bubble-link" data-open-profile-url="${escapeHtml(profile.url)}">Voir la fiche complète ↗</button>` : ""}
  `;

  const rect = trigger.getBoundingClientRect();
  bubble.style.top = `${rect.bottom + 6}px`;
  bubble.style.left = `${rect.left}px`;
  bubble.classList.add("open");

  requestAnimationFrame(() => {
    const bubbleRect = bubble.getBoundingClientRect();

    let left = rect.left;
    const overflowRight = bubbleRect.right - (window.innerWidth - 8);
    if (overflowRight > 0) left -= overflowRight;
    if (left < 8) left = 8;
    bubble.style.left = `${left}px`;

    let top = rect.bottom + 6;
    const overflowBottom = (top + bubbleRect.height) - (window.innerHeight - 8);
    if (overflowBottom > 0) {
      const above = rect.top - bubbleRect.height - 6;
      top = above > 8 ? above : Math.max(8, window.innerHeight - bubbleRect.height - 8);
    }
    bubble.style.top = `${top}px`;
  });
}

function bindProfileBubbleHandlers() {
  if (profileBubbleHandlersBound) return;
  profileBubbleHandlersBound = true;

  document.addEventListener("click", event => {
    const openLinkBtn = event.target.closest("[data-open-profile-url]");
    if (openLinkBtn) {
      openProfileWindow(openLinkBtn.dataset.openProfileUrl);
      closeProfileBubble();
      return;
    }

    const trigger = event.target.closest("[data-profile-matricule]");
    if (trigger) {
      event.preventDefault();
      const bubble = document.getElementById("managerChatProfileBubble");
      const alreadyOpen = bubble
        && bubble.classList.contains("open")
        && bubble.dataset.forMatricule === trigger.dataset.profileMatricule;

      if (alreadyOpen) {
        closeProfileBubble();
      } else {
        openProfileBubble(trigger, trigger.dataset.profileMatricule);
      }
      return;
    }

    const bubbleEl = document.getElementById("managerChatProfileBubble");
    if (bubbleEl && !bubbleEl.contains(event.target)) {
      closeProfileBubble();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeProfileBubble();
  });

  window.addEventListener("scroll", () => closeProfileBubble(), true);
  window.addEventListener("resize", () => closeProfileBubble());
}

/* Affiche le prénom de l'auteur du message (jamais le matricule brut) ;
   si des informations locales sont associées à ce matricule, le texte
   devient un bouton qui ouvre la bulle de profil (voir openProfileBubble). */
function renderMatriculeLabel(matricule) {
  const label = escapeHtml(getDisplayName(matricule));
  const profile = getProfile(matricule);

  if (!profile) {
    return `<span class="manager-chat-message-matricule">${label}</span>`;
  }

  return `
    <button type="button" class="manager-chat-message-matricule manager-chat-message-matricule-link"
            data-profile-matricule="${escapeHtml(matricule)}">
      ${label} 🔗
    </button>
  `;
}

const STORAGE_KEY = "managerChatMatricule";
const MAX_MESSAGE_LENGTH = 500;

/* Thèmes disponibles pour classer les messages.
   Doit rester identique à la liste dans les règles Firestore. */
const THEMES = [
  { key: "general", label: "Général", icon: "💬" },
  { key: "paie", label: "Paie", icon: "💶" },
  { key: "formation", label: "Formation", icon: "🎓" },
  { key: "carrieres", label: "Carrières", icon: "📋" },
  { key: "urgent", label: "Urgent", icon: "🚨" }
];
const THEME_KEYS = THEMES.map(t => t.key);

function getTheme(key) {
  return THEMES.find(t => t.key === key) || THEMES[0];
}

const URL_REGEX = /(https?:\/\/[^\s<]+)/g;
const IMAGE_URL_REGEX = /\.(jpe?g|png|gif|webp)(\?[^\s<]*)?$/i;

let unsubscribeMessages = null;
let currentThemeFilter = "all";
let currentSearchQuery = "";
let latestMessageDocs = [];

/* =========================================================
   UTILITAIRES
========================================================= */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripAccents(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatTime(date) {
  if (!date) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStoredMatricule() {
  return sessionStorage.getItem(STORAGE_KEY);
}

function setStoredMatricule(matricule) {
  sessionStorage.setItem(STORAGE_KEY, matricule);
}

function clearStoredMatricule() {
  sessionStorage.removeItem(STORAGE_KEY);
}

/* Rend le texte d'un message sûr (HTML échappé), transforme les
   liens en liens cliquables, et extrait un aperçu d'image si un
   lien pointe directement vers un fichier image. */
function renderMessageContent(rawMessage) {
  const escaped = escapeHtml(rawMessage || "");
  let imagesHtml = "";

  const textHtml = escaped.replace(URL_REGEX, url => {
    if (IMAGE_URL_REGEX.test(url)) {
      imagesHtml += `
        <a href="${url}" target="_blank" rel="noopener" class="manager-chat-file-image-link">
          <img src="${url}" alt="Image partagée" class="manager-chat-file-image" loading="lazy">
        </a>
      `;
    }
    return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
  });

  return { textHtml, imagesHtml };
}

/* =========================================================
   ÉTAPE 1 — CHOIX DU MATRICULE (écran de secours)
   ---------------------------------------------------------
   Normalement inutile : le matricule vient désormais de la
   page de connexion (managers.html → manager-gate.js) et est
   transmis directement à initManagerChat(). Cet écran ne
   s'affiche que si aucun matricule valide n'a pu être récupéré.
========================================================= */

function renderMatriculeGate() {
  const container = document.getElementById("managerChatContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="manager-chat-identify">
      <h3 class="manager-chat-title">💬 Chat entre encadrants <span class="manager-chat-badge">test</span></h3>
      <p class="manager-chat-hint">
        Choisissez votre identité de test pour rejoindre le chat. Votre matricule
        reste utilisé en interne pour vous identifier de façon fiable, mais
        seul votre prénom est visible des autres encadrants.
      </p>
      <div class="manager-chat-chip-row">
        ${TEST_MATRICULES.map(m => {
          const profile = getProfile(m);
          return `
            <div class="manager-chat-chip-wrap">
              <button type="button" class="manager-chat-chip" data-matricule="${m}">
                ${escapeHtml(getDisplayName(m))}
              </button>
              ${profile ? `
                <button type="button" class="manager-chat-chip-profile-link" data-profile-matricule="${escapeHtml(m)}">
                  🔗 Voir la fiche
                </button>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  container.querySelectorAll(".manager-chat-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const value = chip.dataset.matricule;
      if (!TEST_MATRICULES.includes(value)) return;
      setStoredMatricule(value);
      renderChat(value);
    });
  });
}

/* =========================================================
   ÉTAPE 2 — AFFICHAGE DU CHAT
========================================================= */

function renderChat(matricule) {
  const container = document.getElementById("managerChatContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="manager-chat">
      <div class="manager-chat-header">
        <span class="manager-chat-header-label">
          💬 Vous discutez en tant que <strong>${escapeHtml(getDisplayName(matricule))}</strong>
        </span>
      </div>
      <div class="manager-chat-theme-tabs" id="managerChatThemeTabs">
        <button type="button" class="manager-chat-theme-tab active" data-theme="all">Tous</button>
        ${THEMES.map(t => `
          <button type="button" class="manager-chat-theme-tab" data-theme="${t.key}">
            ${t.icon} ${escapeHtml(t.label)}
          </button>
        `).join("")}
      </div>
      <div class="manager-chat-search-bar">
        <input type="search" id="managerChatSearchInput" class="manager-chat-search-input"
               placeholder="🔎 Rechercher un mot-clé dans les messages…" autocomplete="off"
               aria-label="Rechercher dans les messages du chat">
        <div id="managerChatSearchCount" class="manager-chat-search-count"></div>
      </div>
      <div id="managerChatMessages" class="manager-chat-messages" aria-live="polite">
        <div class="manager-chat-loading">Chargement des messages…</div>
      </div>
      <form id="managerChatForm" class="manager-chat-form">
        <select id="managerChatThemeSelect" class="manager-chat-theme-select" aria-label="Thème du message">
          ${THEMES.map(t => `<option value="${t.key}">${t.icon} ${escapeHtml(t.label)}</option>`).join("")}
        </select>
        <div class="manager-chat-input-wrap">
          <input
            id="managerChatInput"
            type="text"
            maxlength="${MAX_MESSAGE_LENGTH}"
            autocomplete="off"
            placeholder="Écrire un message… (collez un lien pour partager un document)"
            aria-label="Votre message">
          <button type="submit" class="manager-chat-send" aria-label="Envoyer">➤</button>
        </div>
      </form>
    </div>
  `;

  currentThemeFilter = "all";
  currentSearchQuery = "";

  document.getElementById("managerChatThemeTabs").addEventListener("click", event => {
    const tab = event.target.closest(".manager-chat-theme-tab");
    if (!tab) return;

    document.querySelectorAll(".manager-chat-theme-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentThemeFilter = tab.dataset.theme;
    renderMessagesList(matricule);
  });

  document.getElementById("managerChatSearchInput").addEventListener("input", event => {
    currentSearchQuery = event.target.value;
    renderMessagesList(matricule);
  });

  document.getElementById("managerChatMessages").addEventListener("click", async event => {
    const btn = event.target.closest(".manager-chat-delete-btn");
    if (!btn) return;

    const messageId = btn.dataset.deleteId;
    if (!messageId) return;

    const confirmed = confirm("Supprimer ce message pour tout le monde ? Cette action est définitive.");
    if (!confirmed) return;

    btn.disabled = true;
    try {
      await updateDoc(doc(db, "managerChat", messageId), {
        message: "",
        deleted: true
      });
    } catch (err) {
      console.error("Erreur lors de la suppression du message :", err);
      alert("Le message n'a pas pu être supprimé. Réessayez.");
      btn.disabled = false;
    }
  });

  document.getElementById("managerChatForm").addEventListener("submit", async event => {
    event.preventDefault();

    const input = document.getElementById("managerChatInput");
    const themeSelect = document.getElementById("managerChatThemeSelect");
    const message = input.value.trim();
    if (!message) return;

    const theme = THEME_KEYS.includes(themeSelect.value) ? themeSelect.value : "general";

    const submitBtn = event.target.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      await addDoc(collection(db, "managerChat"), {
        matricule,
        message,
        theme,
        createdAt: serverTimestamp()
      });
      input.value = "";
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      alert("Le message n'a pas pu être envoyé. Réessayez dans un instant.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      input.focus();
    }
  });

  listenToMessages(matricule);
}

/* =========================================================
   ÉCOUTE TEMPS RÉEL DES MESSAGES
========================================================= */

function listenToMessages(ownMatricule) {
  if (unsubscribeMessages) unsubscribeMessages();

  const messagesEl = document.getElementById("managerChatMessages");
  if (!messagesEl) return;

  const messagesQuery = query(
    collection(db, "managerChat"),
    orderBy("createdAt", "asc"),
    limit(200)
  );

  unsubscribeMessages = onSnapshot(
    messagesQuery,
    snapshot => {
      latestMessageDocs = snapshot.docs;
      renderMessagesList(ownMatricule);
    },
    err => {
      console.error("Erreur lors de la lecture du chat :", err);
      messagesEl.innerHTML = `<div class="manager-chat-error">Impossible de charger les messages pour le moment. Réessayez plus tard.</div>`;
    }
  );
}

function renderMessagesList(ownMatricule) {
  const messagesEl = document.getElementById("managerChatMessages");
  const countEl = document.getElementById("managerChatSearchCount");
  if (!messagesEl) return;

  const themeFiltered = currentThemeFilter === "all"
    ? latestMessageDocs
    : latestMessageDocs.filter(docSnap => (docSnap.data().theme || "general") === currentThemeFilter);

  const terms = stripAccents(currentSearchQuery.trim().toLowerCase()).split(/\s+/).filter(Boolean);

  const matchIds = new Set();
  if (terms.length > 0) {
    themeFiltered.forEach(docSnap => {
      const normalized = stripAccents(String(docSnap.data().message || "").toLowerCase());
      if (terms.every(term => normalized.includes(term))) {
        matchIds.add(docSnap.id);
      }
    });
  }

  if (countEl) {
    countEl.textContent = terms.length > 0
      ? `${matchIds.size} résultat${matchIds.size > 1 ? "s" : ""}`
      : "";
  }

  if (themeFiltered.length === 0) {
    const emptyLabel = `Aucun message ${currentThemeFilter === "all" ? "pour l'instant" : "dans ce thème"}. Soyez le premier à écrire !`;
    messagesEl.innerHTML = `<div class="manager-chat-empty">${emptyLabel}</div>`;
    return;
  }

  const noticeHtml = (terms.length > 0 && matchIds.size === 0)
    ? `<div class="manager-chat-search-notice">Aucun message ne correspond à « ${escapeHtml(currentSearchQuery.trim())} ». Voici l'ensemble de la discussion.</div>`
    : "";

  messagesEl.innerHTML = noticeHtml + themeFiltered
    .map(docSnap => {
      const data = docSnap.data();
      const date = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
      const isOwn = data.matricule === ownMatricule;
      const theme = getTheme(data.theme);
      const isMatch = matchIds.has(docSnap.id);
      const isDimmed = terms.length > 0 && matchIds.size > 0 && !isMatch;

      if (data.deleted) {
        return `
          <div class="manager-chat-message ${isOwn ? "own" : "other"}">
            <div class="manager-chat-message-meta-row">
              ${isOwn ? "" : renderMatriculeLabel(data.matricule)}
            </div>
            <div class="manager-chat-bubble manager-chat-bubble-deleted">
              <div class="manager-chat-message-text">🚫 Message supprimé</div>
              <div class="manager-chat-message-time">${escapeHtml(formatTime(date))}</div>
            </div>
          </div>
        `;
      }

      const { textHtml, imagesHtml } = renderMessageContent(data.message);

      return `
        <div class="manager-chat-message ${isOwn ? "own" : "other"} ${isMatch ? "search-match" : ""} ${isDimmed ? "search-dim" : ""}"
             ${isMatch ? `data-search-match="1"` : ""}>
          <div class="manager-chat-message-meta-row">
            ${isOwn ? "" : renderMatriculeLabel(data.matricule)}
            <span class="manager-chat-theme-badge">${theme.icon} ${escapeHtml(theme.label)}</span>
          </div>
          <div class="manager-chat-bubble">
            ${imagesHtml}
            <div class="manager-chat-message-text">${textHtml}</div>
            <div class="manager-chat-message-time">
              ${escapeHtml(formatTime(date))}
              ${isOwn ? `<button type="button" class="manager-chat-delete-btn" data-delete-id="${docSnap.id}">Supprimer</button>` : ""}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (terms.length > 0 && matchIds.size > 0) {
    const firstMatch = messagesEl.querySelector('[data-search-match="1"]');
    if (firstMatch) firstMatch.scrollIntoView({ block: "center" });
  } else {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

/* =========================================================
   POINT D'ENTRÉE — appelé par manager-gate.js après
   déverrouillage du code d'accès à l'espace encadrants
========================================================= */

/* matriculeFromGate : matricule déjà saisi et validé sur la page de
   connexion (managers.html), transmis par manager-gate.js. Quand il
   est fourni, on l'utilise directement et on saute l'étape de
   sélection du matricule dans le chat — l'agent ne le saisit qu'une
   fois pour toute la session. */
export function initManagerChat(matriculeFromGate) {
  bindProfileBubbleHandlers();

  const provided = typeof matriculeFromGate === "string" && TEST_MATRICULES.includes(matriculeFromGate)
    ? matriculeFromGate
    : null;

  if (provided) setStoredMatricule(provided);

  const stored = provided || getStoredMatricule();
  if (stored && TEST_MATRICULES.includes(stored)) {
    renderChat(stored);
  } else {
    renderMatriculeGate();
  }
}

window.initManagerChat = initManagerChat;/* =========================================================
   CHAT DE L'ESPACE ENCADRANTS — VERSION DE TEST
   ---------------------------------------------------------
   Chat partagé entre les encadrants ayant accès à l'espace
   managers, stocké dans Cloud Firestore (Firebase). 100%
   gratuit : ce fichier n'utilise QUE Firestore, pas Firebase
   Storage (qui nécessite le forfait payant Blaze).

   Identification : PAR MATRICULE UNIQUEMENT. Aucun nom ni
   prénom n'est jamais envoyé, stocké ou affiché — seul le
   matricule choisi apparaît à côté de chaque message.

   Phase de test : 4 matricules fictifs (10001 à 10004).
   Pour passer aux vrais matricules des encadrants, il suffira
   de remplacer TEST_MATRICULES ci-dessous ET la liste
   correspondante dans les règles de sécurité Firestore
   (rules_version 2, collection managerChat) — les deux
   listes doivent toujours être identiques.

   PAS D'UPLOAD DE FICHIER : pour partager un document ou une
   image, on colle un lien vers une ressource déjà hébergée
   ailleurs (intranet, Drive…). Les liens deviennent cliquables
   automatiquement, et un lien pointant directement vers une
   image (.jpg, .png…) s'affiche en aperçu dans la bulle.

   ⚠️ Ce fichier est chargé en tant que module ES (voir
   managers.html) car il utilise le SDK Firebase via CDN.
   La clé firebaseConfig ci-dessous est une clé "publique"
   côté client : ce n'est pas un secret, c'est la règle de
   sécurité Firestore qui protège réellement les données.
========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfJ5zauVkLWUMp5pjkAIa0gC1H7y2tDr0",
  authDomain: "chat-encadrants.firebaseapp.com",
  projectId: "chat-encadrants",
  storageBucket: "chat-encadrants.firebasestorage.app",
  messagingSenderId: "71961028015",
  appId: "1:71961028015:web:ec36ddc4e2238546d27b5a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Liste des matricules acceptés en phase de test.
   Doit rester identique à la liste dans les règles Firestore. */
const TEST_MATRICULES = ["10001", "10002", "10003", "10004"];

/* Correspondance matricule → prénom affiché dans le chat.
   Le matricule reste utilisé partout en interne (identification,
   sécurité Firestore, bulle de profil) : seul l'AFFICHAGE change,
   pour ne plus jamais montrer le matricule brut aux autres agents. */
const MATRICULE_PRENOMS = {
  "10001": "Jessyca",
  "10002": "Pierre",
  "10003": "Marie",
  "10004": "Aline"
};

function getDisplayName(matricule) {
  return MATRICULE_PRENOMS[matricule] || `Matricule ${matricule || "?"}`;
}

/* Correspondance matricule → informations locales + lien de fiche.
   AUCUN NOM N'EST STOCKÉ ICI : uniquement un service/une fonction que
   TU renseignes toi-même ci-dessous (facultatif), plus le lien vers
   la fiche intranet complète. La bulle affiche ces infos locales
   instantanément (pas de dépendance à l'intranet), avec un lien de
   secours pour ouvrir la fiche complète si besoin de vérifier
   davantage. Remplis service/fonction quand tu les as ; laisse une
   chaîne vide "" si tu ne veux pas les afficher. */
const MATRICULE_PROFILES = {
  "10001": {
    url: "https://c.conflans.mairie-conflans.fr/#!/myprofile/9b0c5e7f-0eb9-4d1a-b00d-b3d8183c23e2/About",
    service: "RH",
    fonction: "Gestionnaire formation"
  }
};

function getProfile(matricule) {
  return MATRICULE_PROFILES[matricule] || null;
}

/* Ouvre la fiche complète dans une petite fenêtre flottante séparée
   (pas une iframe intégrée) : ceci reste une vraie navigation dans
   une fenêtre à part, donc l'intranet ne peut pas la bloquer comme
   il bloquerait une iframe. */
function openProfileWindow(url) {
  const features = "width=520,height=760,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes";
  const win = window.open(url, "managerChatProfileWindow", features);
  if (win) win.focus();
}

/* =========================================================
   BULLE DE PROFIL (info locale, sans dépendance à l'intranet)
========================================================= */

let profileBubbleHandlersBound = false;

function ensureProfileBubble() {
  let bubble = document.getElementById("managerChatProfileBubble");
  if (bubble) return bubble;

  bubble = document.createElement("div");
  bubble.id = "managerChatProfileBubble";
  bubble.className = "manager-chat-profile-bubble";
  document.body.appendChild(bubble);
  return bubble;
}

function closeProfileBubble() {
  const bubble = document.getElementById("managerChatProfileBubble");
  if (bubble) bubble.classList.remove("open");
}

function openProfileBubble(trigger, matricule) {
  const profile = getProfile(matricule);
  if (!profile) return;

  const bubble = ensureProfileBubble();
  bubble.dataset.forMatricule = matricule;

  const lines = [];
  if (profile.service) lines.push(`<div class="manager-chat-profile-bubble-line"><strong>Service :</strong> ${escapeHtml(profile.service)}</div>`);
  if (profile.fonction) lines.push(`<div class="manager-chat-profile-bubble-line"><strong>Fonction :</strong> ${escapeHtml(profile.fonction)}</div>`);

  bubble.innerHTML = `
    ${lines.length > 0 ? lines.join("") : `<div class="manager-chat-profile-bubble-empty">Aucune information renseignée pour ce matricule.</div>`}
    ${profile.url ? `<button type="button" class="manager-chat-profile-bubble-link" data-open-profile-url="${escapeHtml(profile.url)}">Voir la fiche complète ↗</button>` : ""}
  `;

  const rect = trigger.getBoundingClientRect();
  bubble.style.top = `${rect.bottom + 6}px`;
  bubble.style.left = `${rect.left}px`;
  bubble.classList.add("open");

  requestAnimationFrame(() => {
    const bubbleRect = bubble.getBoundingClientRect();

    let left = rect.left;
    const overflowRight = bubbleRect.right - (window.innerWidth - 8);
    if (overflowRight > 0) left -= overflowRight;
    if (left < 8) left = 8;
    bubble.style.left = `${left}px`;

    let top = rect.bottom + 6;
    const overflowBottom = (top + bubbleRect.height) - (window.innerHeight - 8);
    if (overflowBottom > 0) {
      const above = rect.top - bubbleRect.height - 6;
      top = above > 8 ? above : Math.max(8, window.innerHeight - bubbleRect.height - 8);
    }
    bubble.style.top = `${top}px`;
  });
}

function bindProfileBubbleHandlers() {
  if (profileBubbleHandlersBound) return;
  profileBubbleHandlersBound = true;

  document.addEventListener("click", event => {
    const openLinkBtn = event.target.closest("[data-open-profile-url]");
    if (openLinkBtn) {
      openProfileWindow(openLinkBtn.dataset.openProfileUrl);
      closeProfileBubble();
      return;
    }

    const trigger = event.target.closest("[data-profile-matricule]");
    if (trigger) {
      event.preventDefault();
      const bubble = document.getElementById("managerChatProfileBubble");
      const alreadyOpen = bubble
        && bubble.classList.contains("open")
        && bubble.dataset.forMatricule === trigger.dataset.profileMatricule;

      if (alreadyOpen) {
        closeProfileBubble();
      } else {
        openProfileBubble(trigger, trigger.dataset.profileMatricule);
      }
      return;
    }

    const bubbleEl = document.getElementById("managerChatProfileBubble");
    if (bubbleEl && !bubbleEl.contains(event.target)) {
      closeProfileBubble();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeProfileBubble();
  });

  window.addEventListener("scroll", () => closeProfileBubble(), true);
  window.addEventListener("resize", () => closeProfileBubble());
}

/* Affiche le prénom de l'auteur du message (jamais le matricule brut) ;
   si des informations locales sont associées à ce matricule, le texte
   devient un bouton qui ouvre la bulle de profil (voir openProfileBubble). */
function renderMatriculeLabel(matricule) {
  const label = escapeHtml(getDisplayName(matricule));
  const profile = getProfile(matricule);

  if (!profile) {
    return `<span class="manager-chat-message-matricule">${label}</span>`;
  }

  return `
    <button type="button" class="manager-chat-message-matricule manager-chat-message-matricule-link"
            data-profile-matricule="${escapeHtml(matricule)}">
      ${label} 🔗
    </button>
  `;
}

const STORAGE_KEY = "managerChatMatricule";
const MAX_MESSAGE_LENGTH = 500;

/* Thèmes disponibles pour classer les messages.
   Doit rester identique à la liste dans les règles Firestore. */
const THEMES = [
  { key: "general", label: "Général", icon: "💬" },
  { key: "paie", label: "Paie", icon: "💶" },
  { key: "formation", label: "Formation", icon: "🎓" },
  { key: "carrieres", label: "Carrières", icon: "📋" },
  { key: "urgent", label: "Urgent", icon: "🚨" }
];
const THEME_KEYS = THEMES.map(t => t.key);

function getTheme(key) {
  return THEMES.find(t => t.key === key) || THEMES[0];
}

const URL_REGEX = /(https?:\/\/[^\s<]+)/g;
const IMAGE_URL_REGEX = /\.(jpe?g|png|gif|webp)(\?[^\s<]*)?$/i;

let unsubscribeMessages = null;
let currentThemeFilter = "all";
let currentSearchQuery = "";
let latestMessageDocs = [];

/* =========================================================
   UTILITAIRES
========================================================= */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripAccents(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatTime(date) {
  if (!date) return "";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStoredMatricule() {
  return sessionStorage.getItem(STORAGE_KEY);
}

function setStoredMatricule(matricule) {
  sessionStorage.setItem(STORAGE_KEY, matricule);
}

function clearStoredMatricule() {
  sessionStorage.removeItem(STORAGE_KEY);
}

/* Rend le texte d'un message sûr (HTML échappé), transforme les
   liens en liens cliquables, et extrait un aperçu d'image si un
   lien pointe directement vers un fichier image. */
function renderMessageContent(rawMessage) {
  const escaped = escapeHtml(rawMessage || "");
  let imagesHtml = "";

  const textHtml = escaped.replace(URL_REGEX, url => {
    if (IMAGE_URL_REGEX.test(url)) {
      imagesHtml += `
        <a href="${url}" target="_blank" rel="noopener" class="manager-chat-file-image-link">
          <img src="${url}" alt="Image partagée" class="manager-chat-file-image" loading="lazy">
        </a>
      `;
    }
    return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
  });

  return { textHtml, imagesHtml };
}

/* =========================================================
   ÉTAPE 1 — CHOIX DU MATRICULE (écran de secours)
   ---------------------------------------------------------
   Normalement inutile : le matricule vient désormais de la
   page de connexion (managers.html → manager-gate.js) et est
   transmis directement à initManagerChat(). Cet écran ne
   s'affiche que si aucun matricule valide n'a pu être récupéré.
========================================================= */

function renderMatriculeGate() {
  const container = document.getElementById("managerChatContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="manager-chat-identify">
      <h3 class="manager-chat-title">💬 Chat entre encadrants <span class="manager-chat-badge">test</span></h3>
      <p class="manager-chat-hint">
        Choisissez votre identité de test pour rejoindre le chat. Votre matricule
        reste utilisé en interne pour vous identifier de façon fiable, mais
        seul votre prénom est visible des autres encadrants.
      </p>
      <div class="manager-chat-chip-row">
        ${TEST_MATRICULES.map(m => {
          const profile = getProfile(m);
          return `
            <div class="manager-chat-chip-wrap">
              <button type="button" class="manager-chat-chip" data-matricule="${m}">
                ${escapeHtml(getDisplayName(m))}
              </button>
              ${profile ? `
                <button type="button" class="manager-chat-chip-profile-link" data-profile-matricule="${escapeHtml(m)}">
                  🔗 Voir la fiche
                </button>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  container.querySelectorAll(".manager-chat-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const value = chip.dataset.matricule;
      if (!TEST_MATRICULES.includes(value)) return;
      setStoredMatricule(value);
      renderChat(value);
    });
  });
}

/* =========================================================
   ÉTAPE 2 — AFFICHAGE DU CHAT
========================================================= */

function renderChat(matricule) {
  const container = document.getElementById("managerChatContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="manager-chat">
      <div class="manager-chat-header">
        <span class="manager-chat-header-label">
          💬 Vous discutez en tant que <strong>${escapeHtml(getDisplayName(matricule))}</strong>
        </span>
      </div>
      <div class="manager-chat-theme-tabs" id="managerChatThemeTabs">
        <button type="button" class="manager-chat-theme-tab active" data-theme="all">Tous</button>
        ${THEMES.map(t => `
          <button type="button" class="manager-chat-theme-tab" data-theme="${t.key}">
            ${t.icon} ${escapeHtml(t.label)}
          </button>
        `).join("")}
      </div>
      <div class="manager-chat-search-bar">
        <input type="search" id="managerChatSearchInput" class="manager-chat-search-input"
               placeholder="🔎 Rechercher un mot-clé dans les messages…" autocomplete="off"
               aria-label="Rechercher dans les messages du chat">
        <div id="managerChatSearchCount" class="manager-chat-search-count"></div>
      </div>
      <div id="managerChatMessages" class="manager-chat-messages" aria-live="polite">
        <div class="manager-chat-loading">Chargement des messages…</div>
      </div>
      <form id="managerChatForm" class="manager-chat-form">
        <select id="managerChatThemeSelect" class="manager-chat-theme-select" aria-label="Thème du message">
          ${THEMES.map(t => `<option value="${t.key}">${t.icon} ${escapeHtml(t.label)}</option>`).join("")}
        </select>
        <div class="manager-chat-input-wrap">
          <input
            id="managerChatInput"
            type="text"
            maxlength="${MAX_MESSAGE_LENGTH}"
            autocomplete="off"
            placeholder="Écrire un message… (collez un lien pour partager un document)"
            aria-label="Votre message">
          <button type="submit" class="manager-chat-send" aria-label="Envoyer">➤</button>
        </div>
      </form>
    </div>
  `;

  currentThemeFilter = "all";
  currentSearchQuery = "";

  document.getElementById("managerChatThemeTabs").addEventListener("click", event => {
    const tab = event.target.closest(".manager-chat-theme-tab");
    if (!tab) return;

    document.querySelectorAll(".manager-chat-theme-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentThemeFilter = tab.dataset.theme;
    renderMessagesList(matricule);
  });

  document.getElementById("managerChatSearchInput").addEventListener("input", event => {
    currentSearchQuery = event.target.value;
    renderMessagesList(matricule);
  });

  document.getElementById("managerChatMessages").addEventListener("click", async event => {
    const btn = event.target.closest(".manager-chat-delete-btn");
    if (!btn) return;

    const messageId = btn.dataset.deleteId;
    if (!messageId) return;

    const confirmed = confirm("Supprimer ce message pour tout le monde ? Cette action est définitive.");
    if (!confirmed) return;

    btn.disabled = true;
    try {
      await updateDoc(doc(db, "managerChat", messageId), {
        message: "",
        deleted: true
      });
    } catch (err) {
      console.error("Erreur lors de la suppression du message :", err);
      alert("Le message n'a pas pu être supprimé. Réessayez.");
      btn.disabled = false;
    }
  });

  document.getElementById("managerChatForm").addEventListener("submit", async event => {
    event.preventDefault();

    const input = document.getElementById("managerChatInput");
    const themeSelect = document.getElementById("managerChatThemeSelect");
    const message = input.value.trim();
    if (!message) return;

    const theme = THEME_KEYS.includes(themeSelect.value) ? themeSelect.value : "general";

    const submitBtn = event.target.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      await addDoc(collection(db, "managerChat"), {
        matricule,
        message,
        theme,
        createdAt: serverTimestamp()
      });
      input.value = "";
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      alert("Le message n'a pas pu être envoyé. Réessayez dans un instant.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      input.focus();
    }
  });

  listenToMessages(matricule);
}

/* =========================================================
   ÉCOUTE TEMPS RÉEL DES MESSAGES
========================================================= */

function listenToMessages(ownMatricule) {
  if (unsubscribeMessages) unsubscribeMessages();

  const messagesEl = document.getElementById("managerChatMessages");
  if (!messagesEl) return;

  const messagesQuery = query(
    collection(db, "managerChat"),
    orderBy("createdAt", "asc"),
    limit(200)
  );

  unsubscribeMessages = onSnapshot(
    messagesQuery,
    snapshot => {
      latestMessageDocs = snapshot.docs;
      renderMessagesList(ownMatricule);
    },
    err => {
      console.error("Erreur lors de la lecture du chat :", err);
      messagesEl.innerHTML = `<div class="manager-chat-error">Impossible de charger les messages pour le moment. Réessayez plus tard.</div>`;
    }
  );
}

function renderMessagesList(ownMatricule) {
  const messagesEl = document.getElementById("managerChatMessages");
  const countEl = document.getElementById("managerChatSearchCount");
  if (!messagesEl) return;

  const themeFiltered = currentThemeFilter === "all"
    ? latestMessageDocs
    : latestMessageDocs.filter(docSnap => (docSnap.data().theme || "general") === currentThemeFilter);

  const terms = stripAccents(currentSearchQuery.trim().toLowerCase()).split(/\s+/).filter(Boolean);

  const matchIds = new Set();
  if (terms.length > 0) {
    themeFiltered.forEach(docSnap => {
      const normalized = stripAccents(String(docSnap.data().message || "").toLowerCase());
      if (terms.every(term => normalized.includes(term))) {
        matchIds.add(docSnap.id);
      }
    });
  }

  if (countEl) {
    countEl.textContent = terms.length > 0
      ? `${matchIds.size} résultat${matchIds.size > 1 ? "s" : ""}`
      : "";
  }

  if (themeFiltered.length === 0) {
    const emptyLabel = `Aucun message ${currentThemeFilter === "all" ? "pour l'instant" : "dans ce thème"}. Soyez le premier à écrire !`;
    messagesEl.innerHTML = `<div class="manager-chat-empty">${emptyLabel}</div>`;
    return;
  }

  const noticeHtml = (terms.length > 0 && matchIds.size === 0)
    ? `<div class="manager-chat-search-notice">Aucun message ne correspond à « ${escapeHtml(currentSearchQuery.trim())} ». Voici l'ensemble de la discussion.</div>`
    : "";

  messagesEl.innerHTML = noticeHtml + themeFiltered
    .map(docSnap => {
      const data = docSnap.data();
      const date = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
      const isOwn = data.matricule === ownMatricule;
      const theme = getTheme(data.theme);
      const isMatch = matchIds.has(docSnap.id);
      const isDimmed = terms.length > 0 && matchIds.size > 0 && !isMatch;

      if (data.deleted) {
        return `
          <div class="manager-chat-message ${isOwn ? "own" : "other"}">
            <div class="manager-chat-message-meta-row">
              ${isOwn ? "" : renderMatriculeLabel(data.matricule)}
            </div>
            <div class="manager-chat-bubble manager-chat-bubble-deleted">
              <div class="manager-chat-message-text">🚫 Message supprimé</div>
              <div class="manager-chat-message-time">${escapeHtml(formatTime(date))}</div>
            </div>
          </div>
        `;
      }

      const { textHtml, imagesHtml } = renderMessageContent(data.message);

      return `
        <div class="manager-chat-message ${isOwn ? "own" : "other"} ${isMatch ? "search-match" : ""} ${isDimmed ? "search-dim" : ""}"
             ${isMatch ? `data-search-match="1"` : ""}>
          <div class="manager-chat-message-meta-row">
            ${isOwn ? "" : renderMatriculeLabel(data.matricule)}
            <span class="manager-chat-theme-badge">${theme.icon} ${escapeHtml(theme.label)}</span>
          </div>
          <div class="manager-chat-bubble">
            ${imagesHtml}
            <div class="manager-chat-message-text">${textHtml}</div>
            <div class="manager-chat-message-time">
              ${escapeHtml(formatTime(date))}
              ${isOwn ? `<button type="button" class="manager-chat-delete-btn" data-delete-id="${docSnap.id}">Supprimer</button>` : ""}
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (terms.length > 0 && matchIds.size > 0) {
    const firstMatch = messagesEl.querySelector('[data-search-match="1"]');
    if (firstMatch) firstMatch.scrollIntoView({ block: "center" });
  } else {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

/* =========================================================
   POINT D'ENTRÉE — appelé par manager-gate.js après
   déverrouillage du code d'accès à l'espace encadrants
========================================================= */

/* matriculeFromGate : matricule déjà saisi et validé sur la page de
   connexion (managers.html), transmis par manager-gate.js. Quand il
   est fourni, on l'utilise directement et on saute l'étape de
   sélection du matricule dans le chat — l'agent ne le saisit qu'une
   fois pour toute la session. */
export function initManagerChat(matriculeFromGate) {
  bindProfileBubbleHandlers();

  const provided = typeof matriculeFromGate === "string" && TEST_MATRICULES.includes(matriculeFromGate)
    ? matriculeFromGate
    : null;

  if (provided) setStoredMatricule(provided);

  const stored = provided || getStoredMatricule();
  if (stored && TEST_MATRICULES.includes(stored)) {
    renderChat(stored);
  } else {
    renderMatriculeGate();
  }
}

window.initManagerChat = initManagerChat;
