const fs = require('fs');

const towns = [
  "Penàguila",
  "Benifallim",
  "La Torre de les Maçanes",
  "Sella (Marina Baixa)",
  "Orxeta",
  "Relleu",
  "Alcoleja",
  "Xixona",
  "Tibi"
];

async function fetchWikiImage(town) {
  try {
    const res = await fetch(`https://ca.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original|thumbnail&pithumbsize=300&titles=${encodeURIComponent(town)}`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === "-1") return null;
    const page = pages[pageId];
    return {
      title: town,
      original: page.original ? page.original.source : null,
      thumbnail: page.thumbnail ? page.thumbnail.source : null
    };
  } catch(e) {
    return null;
  }
}

async function run() {
  for(let town of towns) {
    const imgs = await fetchWikiImage(town);
    console.log(town, imgs);
  }
}

run();
