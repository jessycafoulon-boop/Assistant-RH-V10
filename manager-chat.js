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
   ÉTAPE 1 — CHOIX DU MATRICULE (identification, sans nom)
========================================================= */

function renderMatriculeGate() {
  const container = document.getElementById("managerChatContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="manager-chat-identify">
      <h3 class="manager-chat-title">💬 Chat entre encadrants <span class="manager-chat-badge">test</span></h3>
      <p class="manager-chat-hint">
        Choisissez votre matricule de test pour rejoindre le chat. Aucun nom n'est
        stocké : seul le matricule apparaît à côté de vos messages, visibles de
        tous les encadrants connectés à cet espace.
      </p>
      <div class="manager-chat-chip-row">
        ${TEST_MATRICULES.map(m => `
          <button type="button" class="manager-chat-chip" data-matricule="${m}">
            ${escapeHtml(m)}
          </button>
        `).join("")}
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
          💬 Vous discutez sous le matricule <strong>${escapeHtml(matricule)}</strong>
        </span>
        <button id="managerChatSwitchBtn" type="button" class="manager-chat-switch">
          Changer
        </button>
      </div>
      <div class="manager-chat-theme-tabs" id="managerChatThemeTabs">
        <button type="button" class="manager-chat-theme-tab active" data-theme="all">Tous</button>
        ${THEMES.map(t => `
          <button type="button" class="manager-chat-theme-tab" data-theme="${t.key}">
            ${t.icon} ${escapeHtml(t.label)}
          </button>
        `).join("")}
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

  document.getElementById("managerChatThemeTabs").addEventListener("click", event => {
    const tab = event.target.closest(".manager-chat-theme-tab");
    if (!tab) return;

    document.querySelectorAll(".manager-chat-theme-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentThemeFilter = tab.dataset.theme;
    renderMessagesList(matricule);
  });

  document.getElementById("managerChatSwitchBtn").addEventListener("click", () => {
    clearStoredMatricule();
    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }
    renderMatriculeGate();
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
  if (!messagesEl) return;

  const filtered = currentThemeFilter === "all"
    ? latestMessageDocs
    : latestMessageDocs.filter(docSnap => (docSnap.data().theme || "general") === currentThemeFilter);

  if (filtered.length === 0) {
    messagesEl.innerHTML = `<div class="manager-chat-empty">Aucun message ${currentThemeFilter === "all" ? "pour l'instant" : "dans ce thème"}. Soyez le premier à écrire !</div>`;
    return;
  }

  messagesEl.innerHTML = filtered
    .map(docSnap => {
      const data = docSnap.data();
      const date = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
      const isOwn = data.matricule === ownMatricule;
      const theme = getTheme(data.theme);
      const { textHtml, imagesHtml } = renderMessageContent(data.message);

      return `
        <div class="manager-chat-message ${isOwn ? "own" : "other"}">
          <div class="manager-chat-message-meta-row">
            ${isOwn ? "" : `<span class="manager-chat-message-matricule">Matricule ${escapeHtml(data.matricule || "?")}</span>`}
            <span class="manager-chat-theme-badge">${theme.icon} ${escapeHtml(theme.label)}</span>
          </div>
          <div class="manager-chat-bubble">
            ${imagesHtml}
            <div class="manager-chat-message-text">${textHtml}</div>
            <div class="manager-chat-message-time">${escapeHtml(formatTime(date))}</div>
          </div>
        </div>
      `;
    })
    .join("");

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

/* =========================================================
   POINT D'ENTRÉE — appelé par manager-gate.js après
   déverrouillage du code d'accès à l'espace encadrants
========================================================= */

export function initManagerChat() {
  const stored = getStoredMatricule();
  if (stored && TEST_MATRICULES.includes(stored)) {
    renderChat(stored);
  } else {
    renderMatriculeGate();
  }
}

window.initManagerChat = initManagerChat;
