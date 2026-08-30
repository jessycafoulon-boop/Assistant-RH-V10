/* =========================================================
   INCOLLABLES RH
   Mini-jeu de fiches recto/verso façon "Les Incollables"
   regroupant plusieurs thèmes RH de la fonction publique
   territoriale : rémunération + entretien professionnel.

   Dépendances (déjà présentes dans app.js) :
   - escapeHtml(value)
   - document.getElementById("gameContainer") (section HTML existante)
   - classe utilitaire .hidden

   Intégration :
   1. Ajouter <script src="incollables-rh.js"></script>
      dans index.html, après app.js.
   2. Ajouter un bouton dans .welcome, par exemple :

      <button
        class="game-launch"
        type="button"
        onclick="startIncollablesRH()">
        🎴 Les Incollables
      </button>
========================================================= */

/* =========================================================
   DONNEES : LES FICHES
========================================================= */

const FICHES_INCOLLABLES = [

  /* --- REMUNERATION --- */

  {
    theme:"Rémunération",
    badge:"🟢 Facile",
    recto:"Sur quoi est basé le traitement de base d'un agent territorial ?",
    verso:"Sur son indice (indice brut / indice majoré), fixé par son grade et son échelon.",
    astuce:"La valeur du point d'indice est la même pour toute la fonction publique — État, territoriale, hospitalière."
  },

  {
    theme:"Rémunération",
    badge:"🟢 Facile",
    recto:"Que signifie SFT sur un bulletin de salaire ?",
    verso:"Supplément Familial de Traitement : un complément versé aux agents ayant au moins un enfant à charge.",
    astuce:"Son montant augmente avec le nombre d'enfants."
  },

  {
    theme:"Rémunération",
    badge:"🟠 Moyen",
    recto:"Que signifie le sigle RIFSEEP ?",
    verso:"Régime Indemnitaire tenant compte des Fonctions, des Sujétions, de l'Expertise et de l'Engagement Professionnel.",
    astuce:"Il a remplacé la plupart des anciennes primes dans les collectivités qui l'ont mis en place."
  },

  {
    theme:"Rémunération",
    badge:"🟠 Moyen",
    recto:"Le RIFSEEP se compose de deux parts. Lesquelles ?",
    verso:"L'IFSE (part fixe, liée au poste) et le CIA (part variable, liée à la manière de servir).",
    astuce:"Le CIA n'est pas automatique : il dépend de l'entretien professionnel."
  },

  {
    theme:"Rémunération",
    badge:"🟠 Moyen",
    recto:"Pourquoi deux agents du même grade peuvent-ils toucher une indemnité de résidence différente ?",
    verso:"Parce qu'elle dépend de la zone géographique de la commune d'affectation (zone 1, 2 ou 3).",
    astuce:"Conflans-Sainte-Honorine se situe en zone d'Île-de-France, donc au taux le plus favorable."
  },

  {
    theme:"Rémunération",
    badge:"🔴 Expert",
    recto:"Que récompense la Nouvelle Bonification Indiciaire (NBI) ?",
    verso:"L'exercice de fonctions spécifiques (encadrement, technicité particulière, accueil du public...), pas l'ancienneté.",
    astuce:"Contrairement aux primes, la NBI compte pour le calcul de la retraite."
  },

  {
    theme:"Rémunération",
    badge:"🔴 Expert",
    recto:"Que signifie « GVT » en matière de masse salariale ?",
    verso:"Glissement Vieillesse Technicité : la hausse mécanique de la masse salariale liée aux avancements d'échelon et de grade des agents.",
    astuce:"C'est un indicateur clé suivi par les services financiers des collectivités chaque année."
  },

  {
    theme:"Rémunération",
    badge:"🟠 Moyen",
    recto:"Comment appelle-t-on l'indemnité qui rémunère les heures supplémentaires dans la territoriale ?",
    verso:"L'IHTS — Indemnité Horaire pour Travaux Supplémentaires.",
    astuce:"Elle ne concerne que les agents de catégorie C et certains agents de catégorie B."
  },

  {
    theme:"Rémunération",
    badge:"🟢 Facile",
    recto:"Qui calcule le taux de prélèvement à la source appliqué sur le bulletin de salaire ?",
    verso:"L'administration fiscale (DGFiP) — l'employeur ne fait qu'appliquer le taux transmis.",
    astuce:"Un agent peut demander un taux « neutre » ou « individualisé » directement aux impôts."
  },

  {
    theme:"Rémunération",
    badge:"🔴 Expert",
    recto:"Sur quoi porte la cotisation retraite prélevée sur le traitement d'un fonctionnaire territorial ?",
    verso:"Uniquement sur le traitement indiciaire — pas sur les primes (sauf via la RAFP).",
    astuce:"C'est pour cette raison qu'existe la RAFP, une retraite additionnelle basée sur les primes."
  },

  {
    theme:"Rémunération",
    badge:"🟠 Moyen",
    recto:"Combien de jour(s) de carence s'applique(nt) en cas d'arrêt maladie dans la fonction publique ?",
    verso:"1 jour de carence non rémunéré (sauf exceptions : maternité, longue maladie...).",
    astuce:"Cette règle a évolué plusieurs fois ces dernières années — toujours utile de vérifier la version en vigueur."
  },

  {
    theme:"Rémunération",
    badge:"🟢 Facile",
    recto:"À quelle fréquence un agent territorial reçoit-il son bulletin de salaire ?",
    verso:"Chaque mois, généralement en fin de mois, selon le calendrier de versement de la collectivité.",
    astuce:"Beaucoup de collectivités le mettent aujourd'hui à disposition sur un espace agent en ligne plutôt qu'en papier."
  },

  /* --- ENTRETIEN PROFESSIONNEL --- */

  {
    theme:"Entretien professionnel",
    badge:"🟢 Facile",
    recto:"Qu'est-ce qui a remplacé la notation chiffrée dans la fonction publique territoriale ?",
    verso:"L'entretien professionnel annuel, généralisé depuis 2015.",
    astuce:"Avant cette réforme, chaque agent recevait une note chiffrée en plus d'une appréciation littérale."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟢 Facile",
    recto:"Que signifie l'acronyme CREP ?",
    verso:"Compte Rendu de l'Entretien Professionnel, le document officiel qui formalise l'entretien.",
    astuce:"C'est ce document qui est ensuite versé au dossier administratif de l'agent."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟢 Facile",
    recto:"Qui mène l'entretien professionnel d'un agent ?",
    verso:"Son supérieur hiérarchique direct, pas le service Ressources Humaines.",
    astuce:"Le service RH accompagne et centralise la campagne, mais ne conduit pas les entretiens lui-même."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟢 Facile",
    recto:"À quelle fréquence l'entretien professionnel a-t-il lieu ?",
    verso:"Une fois par an, généralement en tout début d'année pour évaluer l'année précédente.",
    astuce:"La période exacte de la campagne est fixée par chaque collectivité."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟠 Moyen",
    recto:"Que doit obligatoirement comporter le compte-rendu d'entretien ?",
    verso:"Le bilan de l'année écoulée, les objectifs de l'année à venir, l'appréciation de la valeur professionnelle et les perspectives d'évolution.",
    astuce:"Un CREP incomplet peut être un motif de contestation par l'agent."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟠 Moyen",
    recto:"Que signifie la signature de l'agent sur le CREP ?",
    verso:"Un simple accusé de réception, pas un accord avec son contenu.",
    astuce:"L'agent peut très bien signer tout en indiquant par ailleurs son désaccord."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟠 Moyen",
    recto:"Un agent peut-il contester son évaluation ?",
    verso:"Oui, en demandant une révision à l'autorité territoriale, puis en saisissant la CAP ou le CST si besoin.",
    astuce:"La demande de révision doit être faite dans un délai fixé par la collectivité, souvent 15 jours."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟠 Moyen",
    recto:"Quel lien existe entre l'entretien professionnel et le CIA (part du RIFSEEP) ?",
    verso:"L'appréciation de la manière de servir lors de l'entretien conditionne souvent le montant du CIA versé.",
    astuce:"C'est l'un des rares moments où l'entretien a un effet direct et immédiat sur la rémunération."
  },

  {
    theme:"Entretien professionnel",
    badge:"🔴 Expert",
    recto:"Que devient l'entretien professionnel d'un agent absent lors de la campagne annuelle ?",
    verso:"Il est différé, pas supprimé ni sanctionné automatiquement.",
    astuce:"L'agent conserve le droit à un entretien dès que sa situation le permet à nouveau."
  },

  {
    theme:"Entretien professionnel",
    badge:"🔴 Expert",
    recto:"L'entretien professionnel influence-t-il l'avancement de grade ?",
    verso:"Oui : la valeur professionnelle évaluée lors de l'entretien sert de base à l'appréciation pour les avancements.",
    astuce:"C'est pour cette raison qu'un CREP mal renseigné peut avoir des conséquences sur plusieurs années."
  },

  {
    theme:"Entretien professionnel",
    badge:"🔴 Expert",
    recto:"Depuis quelle loi la notation a-t-elle définitivement disparu au profit de l'entretien professionnel ?",
    verso:"La loi du 20 avril 2016 relative à la déontologie et aux droits des fonctionnaires a généralisé le dispositif à toute la fonction publique territoriale.",
    astuce:"Le dispositif existait déjà à titre expérimental depuis 2010 dans plusieurs collectivités."
  },

  {
    theme:"Entretien professionnel",
    badge:"🟠 Moyen",
    recto:"Un agent qui refuse de signer son CREP peut-il bloquer la procédure ?",
    verso:"Non : le refus est noté sur le document, mais n'empêche pas le compte-rendu de produire ses effets.",
    astuce:"L'agent conserve dans tous les cas la possibilité de demander une révision par la suite."
  }

];

/* =========================================================
   ETAT DU JEU
========================================================= */

let incollablesOrder = [];
let incollablesIndex = 0;
let incollablesRevealed = false;
let incollablesTheme = null;

/* =========================================================
   UTILITAIRES
========================================================= */

function shuffleFiches(list){

  const copy =
    [...list];

  for(let i = copy.length - 1; i > 0; i--){

    const j =
      Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] =
      [copy[j], copy[i]];

  }

  return copy;

}

/* =========================================================
   LANCEMENT DU JEU
========================================================= */

function startIncollablesRH(theme){

  incollablesTheme =
    theme || null;

  const pool =
    incollablesTheme
      ? FICHES_INCOLLABLES.filter(
          fiche => fiche.theme === incollablesTheme
        )
      : FICHES_INCOLLABLES;

  incollablesOrder =
    shuffleFiches(pool);

  incollablesIndex = 0;
  incollablesRevealed = false;

  const welcome =
    document.querySelector(".welcome");

  const gameContainer =
    document.getElementById("gameContainer");

  if(welcome){
    welcome.classList.add("hidden");
  }

  if(gameContainer){
    gameContainer.classList.remove("hidden");
  }

  renderIncollablesCard();

}

/* =========================================================
   FERMETURE DU JEU
========================================================= */

function closeIncollablesRH(){

  const welcome =
    document.querySelector(".welcome");

  const gameContainer =
    document.getElementById("gameContainer");

  if(gameContainer){
    gameContainer.classList.add("hidden");
    gameContainer.innerHTML = "";
  }

  if(welcome){
    welcome.classList.remove("hidden");
  }

}

/* =========================================================
   AFFICHAGE D'UNE FICHE
========================================================= */

function renderIncollablesCard(){

  const gameContainer =
    document.getElementById("gameContainer");

  if(!gameContainer){
    return;
  }

  const fiche =
    incollablesOrder[incollablesIndex];

  const total =
    incollablesOrder.length;

  const position =
    incollablesIndex + 1;

  let html = `
    <div class="game-card">

      <div class="game-header">

        <div>
          <div class="game-title">
            🎴 Les Incollables
          </div>
          <div class="game-subtitle">
            ${escapeHtml(fiche.theme)} — Fiche ${position} / ${total}
          </div>
        </div>

        <div class="game-score">
          ${escapeHtml(fiche.badge)}
        </div>

      </div>

      <div class="case-file" style="background:#2f52a0;color:#fff;">
        <strong>Question</strong>
        ${escapeHtml(fiche.recto)}
      </div>
  `;

  if(incollablesRevealed){

    html += `
      <div class="game-feedback success">
        <strong>Réponse :</strong>
        ${escapeHtml(fiche.verso)}
      </div>

      <div class="hint">
        💡 Le saviez-vous ? ${escapeHtml(fiche.astuce)}
      </div>
    `;

  }

  html += `
      <div class="game-actions">
  `;

  if(!incollablesRevealed){

    html += `
        <button
          class="game-button"
          type="button"
          onclick="revealIncollablesAnswer()">
          Voir la réponse
        </button>
    `;

  }else if(position < total){

    html += `
        <button
          class="game-button"
          type="button"
          onclick="nextIncollablesCard()">
          Fiche suivante ➜
        </button>
    `;

  }else{

    html += `
        <button
          class="game-button"
          type="button"
          onclick="startIncollablesRH(incollablesTheme)">
          🔄 Rejouer avec de nouvelles fiches
        </button>
    `;

  }

  html += `
        <button
          class="game-button secondary"
          type="button"
          onclick="closeIncollablesRH()">
          Retour à l'assistant
        </button>
      </div>

    </div>
  `;

  gameContainer.innerHTML = html;

}

/* =========================================================
   REVELER LA REPONSE
========================================================= */

function revealIncollablesAnswer(){

  incollablesRevealed = true;

  renderIncollablesCard();

}

/* =========================================================
   FICHE SUIVANTE
========================================================= */

function nextIncollablesCard(){

  incollablesIndex += 1;
  incollablesRevealed = false;

  renderIncollablesCard();

}
