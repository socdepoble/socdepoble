import React from "react";
import { createRoot } from "react-dom/client";
import UniversalPage from "../pages/UniversalPage";
import "../components/ui/universal-card.css";

const sampleCards = [
  {
    id: "card-1",
    title: "Projecte de Regeneració",
    subtitle: "Treball comunitari a la serra",
    body: "Reunió dissabte a les 10:00. Portar eines i ganes de fer poble.",
    category: "treball",
    actions: [
      { key: "a1", label: "Veure" },
      { key: "a2", label: "Apuntar-se" },
    ],
  },
  {
    id: "card-2",
    title: "Festa Major",
    subtitle: "Concert i sopar popular",
    body: "Dissabte nit al casal. Música en directe i sopar per a tothom.",
    category: "oci",
    actions: [{ key: "b1", label: "Entrades" }],
  },
  {
    id: "card-3",
    title: "Comunicació Oficial",
    subtitle: "Butlletí mensual",
    body: "Resum d'activitats i convocatòries. Llegir i difondre.",
    category: "official",
    actions: [{ key: "c1", label: "Llegir" }],
  },
];

function App() {
  return <UniversalPage cards={sampleCards} />;
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  const el = document.createElement("div");
  el.id = "root";
  document.body.appendChild(el);
  createRoot(el).render(<App />);
} else {
  createRoot(rootEl).render(<App />);
}
