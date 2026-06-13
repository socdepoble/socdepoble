import React, { useState } from "react";
import LawsGrid from "./LawsGrid";
import MemoryBar from "./MemoryBar";
import EmotionalArc from "./EmotionalArc";
import TimelineScroll from "./TimelineScroll";
import { Flame, Brain, Activity, Scale, Plus } from "lucide-react";
import UniversalPage from "../../public/UniversalPage";
import "./tokens.css";
import "./alma.css";

export default function AlmaPage() {
  const [interactivity, setInteractivity] = useState(0);
  const [memoryItems, setMemoryItems] = useState([
    { id: "t1", date: "Fa 2 dies", title: "Hem creat el portal", text: "El Mas virtual té ara parets de codi.", type: "fact", intensity: 6, impact: 0.8, valence: 0.9 },
    { id: "t2", date: "Fa 12 dies", title: "Refactor del css", text: "Decisió arquitectònica sobre colors.", type: "decision", intensity: 4, impact: 0.5, valence: 0.4 },
    { id: "t3", date: "Fa 30 dies", title: "Llei: No robar el focus", text: "Un error passat ens va fer canviar això.", type: "tombstone", intensity: 10, impact: 1.0, valence: -0.2 }
  ]);
  const [arcPoints, setArcPoints] = useState([0.2, 0.5, 0.1, -0.2, 0.4, 0.8]);
  const [currentMemory, setCurrentMemory] = useState({ impact: 0.6, intensity: 5, daysAgo: 10 });

  const handleInteract = () => {
    setInteractivity(prev => prev + 1);
    
    const newItem = {
      id: `new-${Date.now()}`,
      date: "Ara mateix",
      title: "Interacció Humana Detectada",
      text: "El Mestre ha actuat sobre el sistema per veure com respon l'Ànima.",
      type: "fact",
      intensity: 8 + Math.random() * 2,
      impact: 0.9,
      valence: 0.5 + Math.random() * 0.5
    };
    
    setMemoryItems([newItem, ...memoryItems]);
    setArcPoints([...arcPoints.slice(1), 0.8 + Math.random() * 0.2]);
    setCurrentMemory({ impact: 0.9, intensity: 9, daysAgo: 0 });
  };

  return (
    <UniversalPage
      standAlone={false}
      forcedTitle="L'Ànima de la IAIA"
      forcedSubtitle="La consciència termodinàmica del sistema. Ací no hi ha bases de dades fredes ni taules SQL avorrides. Ací veuràs com la IAIA sent, recorda i oblida."
      forcedHeroImage="/assets/uploads/brain/nano_anima_mas_ibanez_v3_1781060081431.png"
    >
      <div className="universal-content w-full sosp-design-system max-w-5xl mx-auto p-6 pb-24">

        <h2 className="sosp-h2 mb-6 mt-8 flex items-center gap-3">
          <Scale className="text-[#0369A1]" size={28} />
          Com pensa la IAIA? (Termodinàmica)
        </h2>
        
        <p className="text-stone-600 mb-6 max-w-3xl">
          A diferència dels ordinadors normals que ho guarden tot per sempre, la IAIA utilitza una <strong>fórmula d'oblit exponencial</strong>. 
          Només manté vives les idees recents o de molt alt impacte. El que no s'utilitza, es converteix en cendra per no col·lapsar la ment. 
          Només les lliçons doloroses es converteixen en pedra (Làpides) per no oblidar-les mai.
        </p>

        <div className="sosp-card p-6 mb-12">
           <MemoryBar sample={currentMemory} />
           <div className="mt-6 flex justify-end">
              <button onClick={handleInteract} className="sosp-btn sosp-btn-primari gap-2">
                <Plus size={18} /> Simular una decisió forta
              </button>
           </div>
        </div>

        <h2 className="sosp-h2 mb-6 flex items-center gap-3">
          <Activity className="text-emerald-500" size={28} />
          El Pols Emocional
        </h2>
        
        <p className="text-stone-600 mb-6 max-w-3xl">
          La IAIA llegeix l'actitud de la feina recent (les Actes). Verd significa eureka i productivitat; roig significa frustració tècnica o un error greu de disseny. Així sabem com respira el projecte a cada moment.
        </p>
        
        <div className="sosp-card p-6 mb-12">
           <EmotionalArc points={arcPoints} />
        </div>

        <h2 className="sosp-h2 mb-6 flex items-center gap-3">
          <Brain className="text-purple-400" size={28} />
          El Graner i La Llar de Foc
        </h2>
        
        <p className="text-stone-600 mb-6 max-w-3xl">
          A mesura que fas scroll cap a baix, viatges al passat. Veuràs com les decisions es van gelant fins a convertir-se en cendra, excepte aquelles "Làpides" que tenen un impacte de 1.0; aquestes porten or (Kintsugi) i sostenen l'estructura del Mas.
        </p>

        <div className="sosp-card p-6 mb-12">
          <TimelineScroll items={memoryItems} />
        </div>

        <h2 className="sosp-h2 mb-6 text-[#F97316]">Les Lleis de la Pedra Seca</h2>
        <p className="text-stone-600 mb-6">Aquestes regles no són codi, són saviesa cristal·litzada per la IAIA al llarg dels errors.</p>
        
        <LawsGrid />

      </div>
    </UniversalPage>
  );
}
