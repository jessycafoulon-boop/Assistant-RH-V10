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
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

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
const storage = getStorage(app);

/* Liste des matricules acceptés en phase de test.
   Doit rester identique à la liste dans les règles Firestore. */
const TEST_MATRICULES = ["10001", "10002", "10003", "10004"];

const STORAGE_KEY = "managerChatMatricule";
const MAX_MESSAGE_LENGTH = 500;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_FILE_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

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

function isImageType(type) {
  return typeof type === "string" && type.startsWith("image/");
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function sanitizeFileName(name) {
  return String(name || "fichier")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(-120);
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

  let selectedFile = null;

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
      <div id="managerChatMessages" class="manager-chat-messages" aria-live="polite">
        <div class="manager-chat-loading">Chargement des messages…</div>
      </div>
      <div id="managerChatFilePreview" class="manager-chat-file-preview" hidden></div>
      <form id="managerChatForm" class="manager-chat-form">
        <input type="file" id="managerChatFileInput" class="manager-chat-file-input"
               accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" hidden>
        <button type="button" id="managerChatAttachBtn" class="manager-chat-attach" aria-label="Joindre un fichier">📎</button>
        <div class="manager-chat-input-wrap">
          <input
            id="managerChatInput"
            type="text"
            maxlength="${MAX_MESSAGE_LENGTH}"
            autocomplete="off"
            placeholder="Écrire un message…"
            aria-label="Votre message">
          <button type="submit" class="manager-chat-send" aria-label="Envoyer">➤</button>
        </div>
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

  const fileInput = document.getElementById("managerChatFileInput");
  const previewEl = document.getElementById("managerChatFilePreview");

  function renderFilePreview() {
    if (!selectedFile) {
      previewEl.hidden = true;
      previewEl.innerHTML = "";
      return;
    }
    previewEl.hidden = false;
    previewEl.innerHTML = `
      <span class="manager-chat-file-preview-name">
        ${isImageType(selectedFile.type) ? "🖼️" : "📄"} ${escapeHtml(selectedFile.name)}
        <span class="manager-chat-file-preview-size">(${escapeHtml(formatFileSize(selectedFile.size))})</span>
      </span>
      <button type="button" id="managerChatFileRemove" class="manager-chat-file-remove" aria-label="Retirer le fichier">✕</button>
    `;
    document.getElementById("managerChatFileRemove").addEventListener("click", () => {
      selectedFile = null;
      fileInput.value = "";
      renderFilePreview();
    });
  }

  document.getElementById("managerChatAttachBtn").addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("Ce type de fichier n'est pas autorisé. Formats acceptés : images, PDF, Word, Excel.");
      fileInput.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert("Le fichier dépasse la taille maximale autorisée (10 Mo).");
      fileInput.value = "";
      return;
    }

    selectedFile = file;
    renderFilePreview();
  });

  document.getElementById("managerChatForm").addEventListener("submit", async event => {
    event.preventDefault();

    const input = document.getElementById("managerChatInput");
    const message = input.value.trim();
    if (!message && !selectedFile) return;

    const submitBtn = event.target.querySelector("button[type=submit]");
    const attachBtn = document.getElementById("managerChatAttachBtn");
    if (submitBtn) submitBtn.disabled = true;
    if (attachBtn) attachBtn.disabled = true;

    try {
      const payload = {
        matricule,
        message,
        createdAt: serverTimestamp()
      };

      if (selectedFile) {
        const path = `managerChatFiles/${matricule}/${Date.now()}_${sanitizeFileName(selectedFile.name)}`;
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, selectedFile, { contentType: selectedFile.type });
        const url = await getDownloadURL(fileRef);

        payload.fileUrl = url;
        payload.fileName = selectedFile.name;
        payload.fileType = selectedFile.type;
        payload.fileSize = selectedFile.size;
      }

      await addDoc(collection(db, "managerChat"), payload);

      input.value = "";
      selectedFile = null;
      fileInput.value = "";
      renderFilePreview();
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      alert("Le message n'a pas pu être envoyé. Réessayez dans un instant.");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (attachBtn) attachBtn.disabled = false;
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
      if (snapshot.empty) {
        messagesEl.innerHTML = `<div class="manager-chat-empty">Aucun message pour l'instant. Soyez le premier à écrire !</div>`;
        return;
      }

      messagesEl.innerHTML = snapshot.docs
        .map(docSnap => {
          const data = docSnap.data();
          const date = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : null;
          const isOwn = data.matricule === ownMatricule;

          let fileHtml = "";
          if (data.fileUrl) {
            if (isImageType(data.fileType)) {
              fileHtml = `
                <a href="${escapeHtml(data.fileUrl)}" target="_blank" rel="noopener" class="manager-chat-file-image-link">
                  <img src="${escapeHtml(data.fileUrl)}" alt="${escapeHtml(data.fileName || "Image jointe")}" class="manager-chat-file-image">
                </a>
              `;
            } else {
              fileHtml = `
                <a href="${escapeHtml(data.fileUrl)}" target="_blank" rel="noopener" class="manager-chat-file-doc">
                  📄 <span>${escapeHtml(data.fileName || "Document joint")}</span>
                  ${data.fileSize ? `<span class="manager-chat-file-doc-size">${escapeHtml(formatFileSize(data.fileSize))}</span>` : ""}
                </a>
              `;
            }
          }

          return `
            <div class="manager-chat-message ${isOwn ? "own" : "other"}">
              ${isOwn ? "" : `<div class="manager-chat-message-matricule">Matricule ${escapeHtml(data.matricule || "?")}</div>`}
              <div class="manager-chat-bubble">
                ${fileHtml}
                ${data.message ? `<div class="manager-chat-message-text">${escapeHtml(data.message)}</div>` : ""}
                <div class="manager-chat-message-time">${escapeHtml(formatTime(date))}</div>
              </div>
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
