/* =========================================================
   CONFIGURATION
========================================================= */

const ORG_NAME =
  "Mairie de Conflans-Sainte-Honorine";


/* =========================================================
   CONTACTS
========================================================= */

const CONTACTS = {

    emploicompetences:{
    label:"Secteur Emploi et développement des compténces",
    email: " A compléter",
    ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/e7504b01-45da-4aa1-8f7f-45d5f22e4ef0/viewdetail/"
  },
   
    gestionnaireCarriere:{
    label:"Secteur Gestion des carrières",
    email:"rhgestion@mairie-conflans.fr",
    ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/3d4b5cc5-67cf-4b73-aead-3c3c223bd917/viewdetail/"
  },

  rhPaie:{
    label:"Secteur Paie",
    email:"rhpaie@mairie-conflans.fr",
    ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/562850b9-0548-4410-8029-832972da3089/viewdetail/"
  },

  formation:{
    label:"Secteur Formation",
    email:"secteurrhformations@mairie-conflans.fr",
    ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/e7504b01-45da-4aa1-8f7f-45d5f22e4ef0/viewdetail/"
  },

  informatique:{
    label:"Service informatique",
    email:"A_COMPLETER",
    phone:"A_COMPLETER"
  },

  intranet:{
    label:"Secteur Intranet",
    email:"A_COMPLETER",
    phone:"A_COMPLETER",
    ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/7d3a9df8-a60b-468f-ae58-e32e601e0fd2/viewdetail/"
  },

  prevention:{
    label:"Secteur Prévention",
    email:"A_COMPLETER",
    phone:"A_COMPLETER",
    ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/14ce95ca-56d5-44f7-a316-f377e4e2960c/viewdetail/"
  },

  sante:{
    label:"Santé",
    email:"A_COMPLETER",
   ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/3d4b5cc5-67cf-4b73-aead-3c3c223bd917/viewdetail/"
  },
   
 arrettravail:{
    label:"Santé",
    email:"arretdetravail@mairie-conflans.fr",
   ficheUrl:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/3d4b5cc5-67cf-4b73-aead-3c3c223bd917/viewdetail/"
  }
};

/* =========================================================
   DOCUMENTS
========================================================= */

const DOCUMENTS = {

  Gestcarr:{
    title:"Votre Gestionnaire carrière",
    description:
      "Pour connaître le nom de votre Gestionnaire carrière, cliquez sur ce lien.",
    type:"lien",
    format:"Lien",
    url:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/f696bd4c-ba5b-483f-a228-13b29933ef85/viewdetail/"
  },

  tempstravail:{
    title:"Règlement relatif au temps de travail",
    description:
      "Organisation du temps de travail pour les agents de la ville, du CCAS et du théâtre.",
    type:"pdf",
    format:"PDF",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/ab19fec5-96cf-43b7-9b38-4e96e8bdcca6"
  },

  cet:{
    title:"Le Compte Épargne Temps",
    description:
      "Pour connaître le fonctionnement du Compte Épargne Temps, consultez ce document.",
    type:"pdf",
    format:"PDF",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/873c5cac-8923-4be2-8ca3-264c7676b923"
  },

  formulaireRIB:{
    title:"Formulaire de changement de coordonnées bancaires",
    description:
      "Formulaire à utiliser pour transmettre un nouveau RIB.",
    type:"formulaire",
    format:"Formulaire",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/df5ec181-0683-42e0-94d7-193218d840ff"
  },

  transmissiondocument:{
    title:"Comment transmettre vos documents au service RH",
    description:
      "Vous devez transmettre un document au service des Ressources Humaines ?",
    type:"page",
    format:"Page intranet",
    url:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/658dd1e2-3072-45ff-9cc0-61b9913de021/viewdetail/"
  },
   
 transmissionarrettravail:{
    title:"Comment transmettre votre arrêt de travail au service RH",
    description:
      "Nouvelle procédure pour la transmission de vos arrêts de travail",
    type:"page",
    format:"Page intranet",
    url:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/b9ead47b-5319-4fcc-8093-844c8fd66173/viewdetail/"
  },
   
  versementsalaire:{
    title:"Calendrier de versement des salaires 2026",
    description:
      "Calendrier de versement des salaires 2026.",
    type:"page",
    format:"Page intranet",
    url:"https://c.conflans.mairie-conflans.fr/#!/community/Ressources%2520Humaines/b1876ea4-a47a-4cb4-b84e-076eeade8ce6/d8bad4a4-3557-4feb-8087-54df234e8080/72601d00-ac3a-416e-becf-58d4c729c93c/viewdetail/"
  },

  CartePluxee:{
    title:"Bulletin d'adhésion Pluxee",
    description:
      "Formulaire à compléter et transmettre au secteur Paie.",
    type:"formulaire",
    format:"Formulaire",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/1d06e930-963b-46dd-84eb-e8d120113c87"
  },

  CatalogueCNFPT:{
    title:"CNFPT : Offre de formation",
    description:
      "Consultez le catalogue des formations proposées par le CNFPT.",
    type:"page",
    format:"Page web",
    url:"https://www.cnfpt.fr/rechercher-formation?page=1&size=10"
  },

  Formulaireinscriptionformation:{
    title:"Formulaire de demande de formation CNFPT",
    description:
      "Formulaire à compléter pour une demande de formation.",
    type:"formulaire",
    format:"Formulaire",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/e4424002-3d33-442b-aecf-660f628e9a31"
  },

  Reglementformation:{
    title:"Le règlement de formation",
    description:
      "Informations essentielles sur vos droits relatifs à la formation.",
    type:"pdf",
    format:"PDF",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/1e9742a8-6173-4fa1-89ad-e12413e29eda"
  },

  Calendrierconcours:{
    title:"Calendrier des concours et examens professionnels",
    description:
      "Consultez le calendrier des prochains concours et examens professionnels.",
    type:"pdf",
    format:"PDF",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/27a81f61-c8ea-463b-b2d0-2a8d53fca549"
  },

  Prepaconcours:{
    title:"Préparation concours et examens professionnels",
    description:
      "Le CNFPT vous accompagne dans votre préparation.",
    type:"page",
    format:"Page web",
    url:"https://www.cnfpt.fr/evoluer/preparation-aux-concours-concours-examens-professionnels/preparer-concours-ou-examen-professionnel/national"
  },

  ConnexionSMD:{
    title:"Connexion SMD",
    description:
      "Comment accéder à votre compte SMD depuis votre mobile.",
    type:"pdf",
    format:"PDF",
    url:"https://c.conflans.mairie-conflans.fr/#!/media/documents/ad6e2366-b835-43d7-834a-1bcc5658f78e"
  }

};

/* =========================================================
   FAQ
========================================================= */

const FAQ = [

  {
    id:"conges",
    category:"Congés / Absences",
    keywords:[
      "congé","conges","congés","congés annuels",
      "solde congés","poser congé","poser mes congés",
      "annuler congé","modifier congé","reporter congé",
      "congés non pris","jours de congés","vacances",
      "RTT","rtt","absence","CET","solde CET",
      "compte épargne temps","congé bonifié","temps de travail"
    ],
    title:"Question sur vos congés, votre solde ou votre CET",
    answer:
      "Pour une question concernant vos congés, votre CET, votre solde de jours ou une anomalie dans votre compteur, contactez votre gestionnaire carrière.",
    contact:"gestionnaireCarriere",
    documents:["Gestcarr","tempstravail","cet"]
  },

  {
    id:"asa",
    category:"Congés / Absences",
    keywords:[
      "mariage","PACS","déménagement","demenagement",
      "décès","deces","enfant malade","mon enfant est malade",
      "ASA","autorisation spéciale d'absence",
      "absence exceptionnelle","absence urgente",
      "justificatif d'absence"
    ],
    title:"Question sur une absence exceptionnelle (ASA)",
    answer:
      "Pour une question concernant une absence exceptionnelle ou une ASA, contactez votre gestionnaire carrière.",
    contact:"gestionnaireCarriere",
    documents:["transmissiondocument","Gestcarr"]
  },

  {
    id:"salaire",
    category:"Paie",
    keywords:[
      "bulletin","salaire","paie","paye","remuneration",
      "rémunération","fiche de paie","fiche de salaire",
      "bulletin de salaire","prime","prélèvement",
      "prelevement","remboursement","abonnement","transports",
      "Navigo","indemnité","régime indemnitaire",
      "RIFSEEP","IFSE","CIA","NBI","indice majoré",
      "prélèvement à la source",
      "retenue sur salaire","régularisation",
      "heures supplémentaires","astreinte","permanence"
    ],
    title:"Question sur votre bulletin de salaire",
    answer:
      "Pour toute question sur votre dernier bulletin de salaire, son contenu, une prime, une retenue ou une variation de rémunération, contactez le secteur Paie.",
    contact:"rhPaie",
    documents:["versementsalaire"]
  },

  {
    id:"sft",
    category:"Paie",
    keywords:[
      "SFT","supplément familial","supplément familial de traitement",
      "sft enfant","sft montant"
    ],
    title:"Le Supplément Familial de Traitement (SFT)",
    answer:
      "Le SFT est un complément de rémunération versé aux agents ayant au moins un enfant à charge, dont le montant varie selon le nombre d'enfants. Pour toute question sur son calcul ou son versement, contactez le secteur Paie.",
    contact:"rhPaie"
  },
   
    {
    id:"dossieragent",
    category:"Dossier administratif",
    keywords:[
      "dossier","dossier administratif","carrière","arrêté de nomination",
       "titularisation","stagiairisation","situation administrative",
       "position administrative","activité","détachement","disponibilité","congé parental",
       "temps de travail","temps complet","temps non complet","temps partiel",
       "cadre d'emplois","grade","échelon",
       "affectation","mutation","résidence administrative",
       "avancement d'échelon","avancement de grade","promotion interne",
       "adresse","modifier mon adresse","changement d'adresse",
       "changer d'adresse","mise à jour adresse","déménagement agent",
       "état civil","changement d'état civil","changement de nom",
       "changement de situation familiale"
    ],
    title:"Question sur votre dossier administratif ou votre carrière",
    answer:
      "Vous avez une question concernant votre dossier administratif ou vous souhaitez signaler un changement de situation (adresse, état civil...), contactez votre gestionnaire carrière.",
    contact:"gestionnaireCarriere",
    documents:["Gestcarr"]
  },

  {
    id:"rib",
    category:"Paie",
    keywords:[
      "RIB","modifier RIB","changer RIB","changement RIB",
      "nouvelle banque","nouveau RIB","coordonnées bancaires",
      "coordonnees bancaires","compte bancaire",
      "changer de banque","changement de banque"
    ],
    title:"Changement de coordonnées bancaires",
    answer:
      "Pour transmettre votre nouveau RIB, utilisez le formulaire ci-dessous. Si nécessaire, contactez également le secteur Paie.",
    contact:"rhPaie",
    documents:["formulaireRIB"]
  },

  {
    id:"formation",
    category:"Formation",
    keywords:[
      "formation","former","stage","CNFPT","catalogue",
      "formation professionnelle","inscription formation",
      "demande formation","financement formation",
      "bilan de compétences","VAE","validation des acquis",
      "congé de formation","reconversion",
      "projet professionnel","formation obligatoire"
    ],
    title:"Question sur une formation",
    answer:
      "Pour une demande de formation, une question sur le catalogue ou le suivi d'une inscription, contactez le Service Formation.",
    contact:"formation",
    documents:[
      "CatalogueCNFPT",
      "Formulaireinscriptionformation",
      "Reglementformation"
    ]
  },

  {
    id:"concours",
    category:"Formation",
    keywords:[
      "concours","inscription concours","calendrier concours",
      "préparation concours","prépa concours","examen",
      "examen professionnel","examens professionnels"
    ],
    title:"Renseignements sur les concours ou examens professionnels",
    answer:
      "Contactez le service Formation afin de connaître la marche à suivre.",
    contact:"formation",
    documents:[
      "Calendrierconcours",
      "Prepaconcours"
    ]
  },

  {
    id:"cpf",
    category:"Formation",
    keywords:[
      "CPF","compte personnel de formation",
      "heures CPF","compteur CPF","solde CPF"
    ],
    title:"Question concernant votre CPF",
    answer:
      "Pour obtenir des informations sur votre compte CPF ou son utilisation, contactez le service Formation.",
    contact:"formation"
  },

  {
    id:"logiciels-ressources",
    category:"Logiciels / Ressources",
    keywords:[
      "intranet","connexion intranet","connecter intranet",
      "mot de passe intranet","identifiant intranet",
      "login intranet","accès intranet","acces intranet",
      "C.Conflans","espace agents","logiciel","logiciels",
      "ressources","application","applications"
    ],
    title:"Problème de connexion à un logiciel",
    answer:
      "Si vous n'arrivez pas à vous connecter à votre Espace Agents ou à un autre logiciel, contactez le service Informatique.",
    contact:"A créer"
  },

  {
    id:"smd",
    category:"Compte SMD",
    keywords:[
      "connexion SMD","connecter SMD","connexion à SMD",
      "connexion au SMD","compte SMD","compte smd",
      "mot de passe SMD","identifiant SMD",
      "identifiants SMD","login SMD","accès SMD",
      "acces SMD","je ne connais pas mes identifiants"
    ],
    title:"Problème de connexion à votre compte SMD",
    answer:
      "Si vous n'arrivez pas à vous connecter à votre compte SMD, contactez votre gestionnaire carrière.",
    contact:"gestionnaireCarriere",
    documents:[
      "Gestcarr",
      "ConnexionSMD"
    ]
  },

  {
    id:"retraite",
    category:"Retraite",
    keywords:[
      "retraite","départ retraite","depart retraite",
      "partir en retraite","âge retraite","age retraite",
      "trimestres","carrière retraite",
      "erreur carrière","retraite progressive","pension"
    ],
    title:"Question concernant la retraite",
    answer:
      "Pour obtenir des informations sur votre retraite, contactez votre gestionnaire carrière.",
    contact:"gestionnaireCarriere"
  },

  {
    id:"informatique",
    category:"Informatique",
    keywords:[
      "ordinateur","PC","ordinateur portable","imprimante",
      "informatique","souris","clavier","logiciel",
      "écran","ecran","panne informatique"
    ],
    title:"Problème informatique",
    answer:
      "Pour un problème matériel ou informatique, contactez le service informatique de la collectivité.",
    contact:"informatique"
  },

  {
    id:"sante",
    category:"Santé",
    keywords:[
      "visite médicale","visite medicale","medecine du travail",
      "médecine du travail","médecin du travail","medecin du travail",
      "aptitude","inaptitude","reclassement",
      "congé maladie","congé longue maladie",
      "congé longue durée","mi-temps thérapeutique",
      "mi temps therapeutique","santé au travail"
    ],
    title:"Question sur votre santé au travail",
    answer:
      "Pour une question sur votre visite médicale, votre aptitude ou un suivi lié à la médecine du travail, contactez votre gestionnaire Santé.",
    contact:"sante"
  },
   {
    id:"arrêttravail",
    category:"Santé",
    keywords:[
      "arrêt","arret","arrêt de travail","arret de travail"
    ],
    title:"Question sur votre arrêt de travail",
    answer:
      "Vous souhaitez transmettre votre arrêt de travail ou vous avez une question, contactez votre gestionnaire Santé.",
    contact:"arrettravail",
    documents:["transmissionarrettravail"]
  },

  {
    id:"prevention",
    category:"Prévention",
    keywords:[
      "accident du travail","accident de travail","accident de service",
      "maladie professionnelle","sécurité au travail","securite au travail",
      "équipement de protection","equipement de protection","EPI",
      "risques professionnels","document unique"
    ],
    title:"Question sur la prévention, la sécurité ou un accident du travail",
    answer:
      "Pour un accident du travail, une question de sécurité ou un équipement de protection, contactez le secteur Prévention.",
    contact:"prevention"
  },

  {
    id:"easter",
    category:"Humour",
    keywords:[
      "licorne",
      "en pls"
    ],
    title:"🦄 Vous avez trouvé un passage secret !",
    answer:
      "Bien joué. Vous venez de découvrir un petit secret de l'Assistant RH. Puisque vous êtes joueur, un défi un peu plus sérieux vous attend…",
    challenge:true
  }

];

/* =========================================================
   SUGGESTIONS
========================================================= */

const suggestions = [

  [
    "🏖️ Congés / Absences",
    "J'ai un problème avec mes congés"
  ],

  [
    "💶 Paie",
    "Je ne comprends pas mon dernier bulletin de salaire"
  ],

  [
    "🗂️ Dossier administratif",
    "Comment modifier mon adresse ?"
  ],
   
[
    "🩺 Santé",
    "J'ai une question sur ma visite médicale"
  ],
   
 [
    "🦺 Prévention",
    "J'ai eu un accident du travail"
  ],

  [
    "🎓 Formation",
    "Je souhaite faire une formation"
  ],

  [
    "🎯 Compte SMD",
    "Je ne connais pas mes identifiants"
  ],

  [
    "💻 Logiciels / Ressources",
    "J'ai besoin d'accéder à mon Espace Agents "
  ],

  [
    "👩‍🦳 Retraite",
    "Quand pourrai-je partir à la retraite ?"
  ],

 
];

/* =========================================================
   SECURITE
========================================================= */

function escapeHtml(value){

  return String(value).replace(
    /[&<>"']/g,
    char => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[char])
  );

}

/* =========================================================
   NORMALISATION
========================================================= */

function normalize(value){

  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .trim();

}

/* =========================================================
   DETECTION MOBILE
========================================================= */

function isMobileDevice(){

  return window.matchMedia(
    "(max-width:600px)"
  ).matches;

}

/* =========================================================
   CONTACT
========================================================= */

function contactHtml(key){

  const contact =
    CONTACTS[key];

  if(!contact){
    return "";
  }

  const emailOk =
    contact.email &&
    !contact.email.includes("A_COMPLETER");

  const phoneOk =
    contact.phone &&
    !contact.phone.includes("A_COMPLETER");

  let html = `
    <div class="contact">

      <strong>
        📍 Votre interlocuteur :
        ${escapeHtml(contact.label)}
      </strong>
  `;

  if(emailOk){

    html += `
      <div>
        ✉️
        <a
          href="mailto:${escapeHtml(contact.email)}">

          ${escapeHtml(contact.email)}

        </a>
      </div>
    `;

  }

  if(phoneOk){

    const cleanPhone =
      String(contact.phone)
        .replace(/\s+/g,"");

    html += `
      <div>
        ☎️
        <a
          href="tel:${escapeHtml(cleanPhone)}">

          ${escapeHtml(contact.phone)}

        </a>
      </div>
    `;

  }

  if(contact.ficheUrl){

    html += `
      <div>
        🪪
        <a
          href="${escapeHtml(contact.ficheUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          data-resource-link
          data-title="${escapeHtml(contact.label)}">

          Voir la fiche contact

        </a>
      </div>
    `;

  }

  html += `
    </div>
  `;

  return html;

}

/* =========================================================
   DOCUMENTS
========================================================= */

function documentButton(key){

  const doc =
    DOCUMENTS[key];

  if(!doc || !doc.url){
    return "";
  }

  let icon = "🔗";
  let label = "Ouvrir";

  if(doc.type === "pdf"){
    icon = "📄";
    label = "Ouvrir le PDF";
  }

  if(doc.type === "page"){
    icon = "🌐";
    label = "Ouvrir la page";
  }

  if(doc.type === "formulaire"){
    icon = "📝";
    label = "Ouvrir le formulaire";
  }

  if(doc.type === "annuaire"){
    icon = "👤";
    label = "Ouvrir l'annuaire";
  }

  return `
    <div class="document-box">

      <div class="document-title">
        ${icon}
        ${escapeHtml(doc.title)}
      </div>

      <div class="document-description">
        ${escapeHtml(doc.description)}
      </div>

      <span class="document-format">
        ${escapeHtml(doc.format)}
      </span>

      <div class="actions">

        <button
          class="action primary"
          type="button"
          onclick="openDocumentByKey('${escapeHtml(key)}')">

          ${icon}
          ${label}

        </button>

      </div>

    </div>
  `;

}

/* =========================================================
   OUVERTURE DOCUMENT
========================================================= */

function openDocumentByKey(key){

  const doc =
    DOCUMENTS[key];

  if(!doc || !doc.url){
    return;
  }

  if(isMobileDevice()){

    showMobileDocumentNotice(doc);

    return;
  }

  window.open(
    doc.url,
    "_blank",
    "noopener,noreferrer"
  );

}

/* =========================================================
   MODALE DOCUMENT MOBILE
========================================================= */

function showMobileDocumentNotice(doc){

  const existing =
    document.getElementById(
      "documentModal"
    );

  if(existing){
    existing.remove();
  }

  const modal =
    document.createElement("div");

  modal.id =
    "documentModal";

  modal.innerHTML = `
    <div
      class="document-overlay"
      onclick="closeDocumentModal(event)">

      <div
        class="document-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="documentModalTitle"
        onclick="event.stopPropagation()">

        <button
          class="document-close"
          type="button"
          aria-label="Fermer"
          onclick="closeDocumentModal()">

          ✕

        </button>

        <div class="document-icon">
          📄
        </div>

        <h3 id="documentModalTitle">
          ${escapeHtml(
            doc.title || "Document RH"
          )}
        </h3>

        <p>
          Vous consultez ce document depuis
          un téléphone.
          L'accès à certains documents ou pages de
          l'intranet peut nécessiter une nouvelle
          connexion.
        </p>

        <p class="document-info">

          Si l'intranet vous demande vos
          identifiants, connectez-vous puis
          revenez dans votre navigateur.

        </p>

        <p class="document-info">

          Après consulté le lien, balayez votre
          écran vers la gauche pour revenir à
          votre assistant RH.

        </p>

        <div class="actions document-actions">

          <a
            class="action primary"
            href="${escapeHtml(doc.url)}">

            🔐 Ouvrir le document

          </a>

          <button
            class="action"
            type="button"
            onclick="closeDocumentModal()">

            Retour

          </button>

        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  lockBodyScroll();

}

/* =========================================================
   FERMETURE MODALE
========================================================= */

function closeDocumentModal(event){

  if(
    event &&
    event.target !== event.currentTarget
  ){
    return;
  }

  const modal =
    document.getElementById(
      "documentModal"
    );

  if(modal){
    modal.remove();
  }

  unlockBodyScroll();

}

/* =========================================================
   VERROUILLAGE / DEVERROUILLAGE DU SCROLL
   (html + body, pour compatibilité mobile large)
========================================================= */

function lockBodyScroll(){

  document.documentElement.style.overflow =
    "hidden";

  document.body.style.overflow =
    "hidden";

}

function unlockBodyScroll(){

  document.documentElement.style.overflow =
    "";

  document.body.style.overflow =
    "";

}

/* =========================================================
   FILET DE SECURITE : si la modale n'existe plus mais que
   le scroll est resté verrouillé, on le débloque
========================================================= */

function ensureScrollUnlocked(){

  const modalStillOpen =
    document.getElementById(
      "documentModal"
    );

  if(!modalStillOpen){
    unlockBodyScroll();
  }

}

/* =========================================================
   MOTEUR RH
========================================================= */

function scoreQuestion(question,item){

  const q =
    normalize(question);

  let score = 0;

  for(const keyword of item.keywords){

    const k =
      normalize(keyword);

    if(q.includes(k)){

      score +=
        k.length >= 7
          ? 3
          : 2;

    }

  }

  return score;

}

function findMatches(question){

  return FAQ
    .map(item => ({
      item,
      score:
        scoreQuestion(
          question,
          item
        )
    }))
    .filter(x => x.score > 0)
    .sort(
      (a,b) =>
        b.score - a.score
    );

}

/* =========================================================
   CHAT
========================================================= */

function addMessage(html, who = "bot"){
  const element = document.createElement("div");
  element.className = "msg " + who;
  element.innerHTML = html;
  document.getElementById("chat").appendChild(element);

  requestAnimationFrame(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  });
}

/* =========================================================
   REPONSE RH
========================================================= */

function answer(question){

  const matches =
    findMatches(question);

  if(!matches.length){

    addMessage(`
      <div class="answer">

        <h3>
          Je n'ai pas identifié votre demande
        </h3>

        <p>
          Essayez avec des mots comme
          <strong>congés</strong>,
          <strong>paie</strong>,
          <strong>formation</strong>,
          <strong>RIB</strong>,
          <strong>intranet</strong>
          ou
          <strong>informatique</strong>.
        </p>

      </div>
    `);

    return;

  }

  const best =
    matches[0];

  let html = `
    <div class="answer">

      <span class="badge">
        ${escapeHtml(
          best.item.category
        )}
      </span>

      <h3>
        ${escapeHtml(
          best.item.title
        )}
      </h3>

      <p>
        ${escapeHtml(
          best.item.answer
        )}
      </p>
  `;

  if(best.item.challenge){

    html += `
      <div class="actions">

        <button
          class="action primary"
          type="button"
          onclick="startTreasureHunt()">

          🗝️ Envie de jouer ?

        </button>

      </div>
    `;

  }else{

    html +=
      contactHtml(
        best.item.contact
      );

    if(best.item.documents){

      html +=
        best.item.documents
          .map(key =>
            documentButton(key)
          )
          .join("");

    }

  }

  html += `
    </div>
  `;

  addMessage(html);

}

/* =========================================================
   FORMULAIRE QUESTION
========================================================= */

document.getElementById("questionForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = document.getElementById("question");
  const question = input.value.trim();
  if(!question) return;

  addMessage(escapeHtml(question), "user");
  input.value = "";
  input.blur(); // sur mobile, ferme le clavier après l'envoi

  setTimeout(() => answer(question), 120);
});

/* =========================================================
   SUGGESTIONS
========================================================= */

const suggestionsContainer = document.getElementById("suggestions");

suggestions.forEach(([label, question]) => {
  const button = document.createElement("button");
  button.className = "chip";
  button.type = "button";
  button.textContent = label;

  button.onclick = () => {
    addMessage(escapeHtml(question), "user");
    setTimeout(() => answer(question), 120);
  };

  suggestionsContainer.appendChild(button);
});

/* =========================================================
   MESSAGE INITIAL
========================================================= */

addMessage(`

  <div class="answer">

    <h3>
      👋 Je suis prêt !
    </h3>

    <p>
      Posez-moi votre question ou choisissez
      une suggestion pour commencer.
    </p>

    <p>
      Et si vous avez envie de tester vos connaissances,
      <strong>cliquez sur 🕵️ Aider Sam ?</strong>
      ou lancez <strong>🎴 Les Incollables</strong>.
    </p>

  </div>

`);
document.getElementById("chat").lastElementChild.id = "welcomeMessage";

/* =========================================================
   RESTAURATION DU FEEDBACK
========================================================= */

try{
  if(localStorage.getItem("assistantRH_liked") === "true"){
    // Le bouton n'existe que lorsque le jeu est terminé,
    // donc rien à faire ici pour le moment.
  }
}catch(error){
  /* LocalStorage indisponible */
}

/* =========================================================
   FERMETURE MODALE AVEC ECHAP
========================================================= */

document.addEventListener("keydown", event => {
  if(event.key !== "Escape") return;
  closeDocumentModal();
});

/* =========================================================
   RESTAURATION DEPUIS LE CACHE DE NAVIGATION (bfcache)
   Evite de rester bloqué avec la modale ouverte et le
   scroll verrouillé après un retour arrière sur mobile
========================================================= */

window.addEventListener("pageshow", () => {
  closeDocumentModal();
});

document.addEventListener("visibilitychange", () => {
  if(document.visibilityState !== "visible") return;
  closeDocumentModal();
});

window.addEventListener("focus", () => {
  closeDocumentModal();
});

/* =========================================================
   OUVERTURE MOBILE DES LIENS DE FICHE CONTACT
   (interception des liens marqués data-resource-link)
========================================================= */

document.addEventListener("click", event => {
  const link = event.target.closest("[data-resource-link]");
  if(!link) return;
  if(!isMobileDevice()) return;

  event.preventDefault();
  showMobileDocumentNotice({
    url: link.getAttribute("href"),
    title: link.dataset.title || link.textContent.trim()
  });
});
