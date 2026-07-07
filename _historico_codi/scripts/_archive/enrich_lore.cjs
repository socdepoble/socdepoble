const fs = require('fs');

let code = fs.readFileSync('src/data/index.js', 'utf8');

// 1. Replace Central with La Torre de les Maçanes
code = code.replace(/town_name:\s*"Poble Principal:\s*Central"/g, 'town_name: "La Torre de les Maçanes"');
code = code.replace(/town_name:\s*"Central"/g, 'town_name: "La Torre de les Maçanes"');
code = code.replace(/town_name:\s*"Poble Principal:\s*La Torre de les Maçanes"/g, 'town_name: "La Torre de les Maçanes"');

// 2. Fix Market Items
// Pomes de la Torre
code = code.replace(/seller:\s*"Cooperativa de la Torre",\s*avatar_url:\s*"(.*?)",/g, 'seller: "Cooperativa de la Torre",\n    avatar_url: "/uploads/avatars/vicent_ferris_comic.png",\n    author_name: "Vicent Ferris",');

// Oli d'Oliva
code = code.replace(/seller:\s*"Cooperativa Agrícola Alcoi",\s*avatar_url:\s*"(.*?)",/g, 'seller: "Almàssera la Muntanya",\n    avatar_url: "/uploads/avatars/vicent_ferris_comic.png",\n    author_name: "Vicent Ferris",');

// Romero pur
code = code.replace(/seller:\s*"Herbes del Poble",\s*avatar_url:\s*"(.*?)",/g, 'seller: "Farmàcia Rural de Relleu",\n    avatar_url: "/uploads/avatars/carla_soriano_comic.png",\n    author_name: "Carla Soriano",');

// Sabó artesà
code = code.replace(/seller:\s*"Artesans d'Orxeta",\s*avatar_url:\s*"(.*?)",/g, 'seller: "Farmàcia Rural de Relleu",\n    avatar_url: "/uploads/avatars/carla_soriano_comic.png",\n    author_name: "Carla Soriano",');

// Miel
code = code.replace(/seller:\s*"Apicultors Relleu",\s*avatar_url:\s*"(.*?)",/g, 'seller: "El Rusc de Pepica",\n    avatar_url: "/uploads/avatars/pepica_vall_comic.png",\n    author_name: "Pepica la Vall",');

// Alls tendres
code = code.replace(/seller:\s*"Horta de Xixona",\s*avatar_url:\s*"(.*?)",/g, 'seller: "Hort del Tio Pep",\n    avatar_url: "/uploads/avatars/andreu_soler_comic.png",\n    author_name: "Andreu Soler",');

// Ensure Sóc de Poble author uses correct logo
code = code.replace(/seller:\s*"Sóc de Poble",\s*avatar_url:\s*"(.*?)",/g, 'seller: "Sóc de Poble",\n    avatar_url: "/assets/ui/logo-socdepoble-rect-negre.svg",\n    author_name: "Sóc de Poble",');

fs.writeFileSync('src/data/index.js', code);
console.log("Lore enriched successfully!");
