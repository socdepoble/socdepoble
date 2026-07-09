/* eslint-disable no-useless-escape */
export const MOCK_CHATS = [{
  id: "iaia-maria",
  name: "IAIA MarIA",
  message: "Bon dia a tots els socarrats i socarrades!",
  time: "Ara",
  type: "iaia",
  unread: 3,
  avatar_url: "/assets/fotos/iaia-maria.png",
  is_iaia: true,
  verified: true
}, {
  id: "andreu-soler",
  name: "Andreu Soler",
  message: "Això entra al planning.",
  time: "3:35 p. m.",
  type: "iaia",
  unread: 0,
  avatar_url: "/assets/uploads/gent/avatars/andreu-soler-comic.png",
  is_iaia: true
}, {
  id: "beatriz-ortega",
  name: "Beatriz Ortega",
  message: "Teniu coques de xulla hui?",
  time: "12:19 p. m.",
  type: "iaia",
  unread: 0,
  avatar_url: "/assets/uploads/gent/avatars/beatriz-ortega-comic.png",
  is_iaia: true
}, {
  id: "carla-soriano",
  name: "Carla Soriano",
  message: "Alguna proposta per al cap de setmana?",
  time: "6:13 p. m.",
  type: "iaia",
  unread: 0,
  avatar_url: "/assets/uploads/gent/avatars/carla-soriano_comic.png",
  is_iaia: true
}, {
  id: "vicent-ferris",
  name: "Vicent Ferris",
  message: "La setmana que ve ja podem portar les olives?",
  time: "2:16 p. m.",
  type: "iaia",
  unread: 0,
  avatar_url: "/assets/uploads/avatars/vicent-ferris-comic.png",
  is_iaia: true
}, {
  id: "el-viatjant",
  name: "El Viatjant",
  message: "Molt bona idea. Açò necessita una mica de viatge.",
  time: "9:48 p. m.",
  type: "iaia",
  unread: 0,
  avatar_url: "/assets/fotos/el-viatjant.png",
  is_iaia: true
}];
export const MOCK_MESSAGES = {
  "iaia-maria": [{
    id: 1,
    text: "Bon dia a tots els socarrats i socarrades!",
    sender: "other",
    time: "09:00"
  }, {
    id: 2,
    text: "Recordeu que hui es dia de mercat al Pla i hi ha talls de trànsit.",
    sender: "other",
    time: "10:30"
  }, {
    id: 3,
    text: "Teniu tota la informació a la web municipal.",
    sender: "other",
    time: "10:31"
  }],
  "beatriz-ortega": [{
    id: 1,
    text: "Hola! Teniu coques de xulla hui?",
    sender: "me",
    time: "08:15"
  }, {
    id: 2,
    text: "I tant! Acaben d'eixir del forn ara mateix. Vine abans que s'acaben!",
    sender: "other",
    time: "09:15"
  }],
  "el-viatjant": [{
    id: 1,
    text: "Alguna proposta per al cap de setmana?",
    sender: "me",
    time: "Ahir"
  }, {
    id: 2,
    text: "Què vos pareix una pujada al Montcabrer el diumenge pel matí?",
    sender: "other",
    time: "18:20"
  }],
  "vicent-ferris": [{
    id: 1,
    text: "La setmana que ve ja podem portar les olives?",
    sender: "me",
    time: "Dilluns"
  }, {
    id: 2,
    text: "Sí! Iniciem la recollida oficial demà a les 8h del matí.",
    sender: "other",
    time: "Ahir"
  }],
  "carla-soriano": [{
    id: 1,
    text: "Hola Vicent, com va el moble del menjador?",
    sender: "me",
    time: "Dilluns"
  }, {
    id: 2,
    text: "Molt bé! Et passe ara mateix la foto de com està quedant.",
    sender: "other",
    time: "Dimarts"
  }],
  "andreu-soler": [{
    id: 1,
    text: "Bon dia Javi! Com a tresorer, necessitem que signes l'acta de l'última reunió.",
    sender: "other",
    time: "09:00"
  }, {
    id: 2,
    text: "Ah, i recorda que tenim el CIF G-54321987 verificat al sistema. Tot en ordre amb Hisenda.",
    sender: "other",
    time: "09:05"
  }, {
    id: 3,
    text: "Perfecte, ho signe ara mateix. Com a membre fundador és un orgull veure com creixem! 🏛️",
    sender: "me",
    time: "09:10"
  }],
  "marc-el-gall": [{
    id: 1,
    text: "Quiric-quiric! Tinc el cel ben mirat i veig núvols baixos per la serra.",
    sender: "other",
    time: "07:00"
  }, {
    id: 2,
    text: "Si vols, et deixe la previsió i et dic quan afluixarà el vent.",
    sender: "other",
    time: "07:05"
  }],
  "grup-treball": [{
    id: 1,
    text: "Bona nit família! Estic molt emocionat de veure com bateguem junts en esta versió vitaminada. 🚀",
    sender_name: "Javi",
    sender: "other",
    time: "21:00"
  }, {
    id: 2,
    text: "L'IAIA MarIA ja forma part del grup. És un somni fet realitat! 😍",
    sender_name: "Damià",
    sender: "other",
    time: "21:05"
  }, {
    id: 3,
    text: "Bona nit i salut a tota la bona gent del Grup de Treball! Ací em teniu per a posar trellat i utilitat social a cada píxel que bateguem. Anem a fer coses grans! 👵✨⚖️",
    sender_name: "IAIA MarIA",
    sender: "other",
    time: "Ara",
    is_ai: true
  }]
};
