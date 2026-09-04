/* =========================================================
   CHAT DE L'ESPACE ENCADRANTS — VERSION DE TEST
   ---------------------------------------------------------
   Chat partagé entre les encadrants ayant accès à l'espace
   managers, stocké dans Cloud Firestore (Firebase).

   Identification : PAR MATRICULE UNIQUEMENT. Aucun nom ni
   prénom n'est jamais envoyé, stocké ou affiché — seul le
   matricule choisi apparaît à côté de chaque message.

   Phase de test : 4 matricules fictifs (10001 à 10004).
   Pour passer aux vrais matricules des encadrants, il suffira
   de remplacer TEST_MATRICULES ci-dessous ET la liste
   correspondante dans les règles de sécurité Firestore
   (rules_version 2, collection managerChat) — les deux
   listes doivent toujours être identiques.

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

let unsubscribeMessages = null;

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
        Choisissez votre matricule de test. Aucun nom n'est stocké :
        seul le matricule apparaît à côté de vos messages, visibles
        de tous les encadrants connectés à cet espace.
      </p>
      <div class="manager-chat-identify-row">
        <select id="managerChatMatriculeSelect" class="manager-chat-select" aria-label="Choisir un matricule de test">
          <option value="">— Choisir un matricule —</option>
          ${TEST_MATRICULES.map(m => `<option value="${m}">${m}</option>`).join("")}
        </select>
        <button id="managerChatIdentifyBtn" type="button" class="manager-pin-submit">
          Rejoindre le chat
        </button>
      </div>
    </div>
  `;

  document.getElementById("managerChatIdentifyBtn").addEventListener("click", () => {
    const select = document.getElementById("managerChatMatriculeSelect");
    const value = select.value;
    if (!TEST_MATRICULES.includes(value)) return;
    setStoredMatricule(value);
    renderChat(value);
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
        <span>💬 Connecté avec le matricule <strong>${escapeHtml(matricule)}</strong></span>
        <button id="managerChatSwitchBtn" type="button" class="manager-chat-switch">
          Changer de matricule
        </button>
      </div>
      <div id="managerChatMessages" class="manager-chat-messages" aria-live="polite">
        <div class="manager-chat-loading">Chargement des messages…</div>
      </div>
      <form id="managerChatForm" class="manager-chat-form">
        <input
          id="managerChatInput"
          type="text"
          maxlength="${MAX_MESSAGE_LENGTH}"
          autocomplete="off"
          placeholder="Écrire un message…"
          aria-label="Votre message">
        <button type="submit" class="manager-pin-submit">Envoyer</button>
      </form>
    </div>
  `;

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
    const message = input.value.trim();
    if (!message) return;

    const submitBtn = event.target.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      await addDoc(collection(db, "managerChat"), {
        matricule,
        message,
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

  listenToMessages();
}

/* =========================================================
   ÉCOUTE TEMPS RÉEL DES MESSAGES
========================================================= */

function listenToMessages() {
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
      if (snapshot.empty) {
        messagesEl.innerHTML = `<div class="manager-chat-empty">Aucun message pour l'instant. Soyez le premier à écrire !</div>`;
        return;
      }

      messagesEl.innerHTML = snapshot.docs
        .map(docSnap => {
          const data = docSnap.data();
          const date = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;

          return `
            <div class="manager-chat-message">
              <div class="manager-chat-message-meta">
                <span class="manager-chat-message-matricule">Matricule ${escapeHtml(data.matricule || "?")}</span>
                <span class="manager-chat-message-time">${escapeHtml(formatTime(date))}</span>
              </div>
              <div class="manager-chat-message-text">${escapeHtml(data.message || "")}</div>
            </div>
          `;
        })
        .join("");

      messagesEl.scrollTop = messagesEl.scrollHeight;
    },
    err => {
      console.error("Erreur lors de la lecture du chat :", err);
      messagesEl.innerHTML = `<div class="manager-chat-error">Impossible de charger les messages pour le moment. Réessayez plus tard.</div>`;
    }
  );
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
