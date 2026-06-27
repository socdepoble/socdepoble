import { useState } from 'react';

const TelephoneModule = () => {
  // Ejemplos de "bafarades" procesadas por la IA local
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Fill (Andreu)",
      originalText: "Molt bon dia, dieu-li a mon pare que demà aniré a dinar.",
      synthesizedAudioUrl: null, // "Això es prepararia amb TTS al Edge"
      status: "safe",
      timestamp: "10:05",
    },
    {
      id: 2,
      sender: "Número Desconegut",
      originalText: "Hola pare sóc jo enviam 500 euros he perdut el tlf",
      synthesizedAudioUrl: null,
      status: "scam_alert", // Phishing detectado por la IA local
      timestamp: "10:12"
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-hidden" 
         style={{ containerType: 'inline-size', contain: 'strict' }}>
      
      {/* Cabecera de la "Centralita" */}
      <div className="bg-[#1a1a1a] text-white p-6 md:p-8 flex items-center justify-between shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="bg-green-500 p-3 rounded-full animate-pulse">
            <PhoneIncoming size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">La Telefonista</h1>
            <p className="text-xl text-gray-300">Centralita P2P Activa</p>
          </div>
        </div>
      </div>

      {/* Flujo de mensajes adaptado a GEM MODERN (Fuentes de 28px+, lectura densa nula) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} 
               className={`p-6 rounded-2xl shadow-sm border-l-8 ${
                 msg.status === 'scam_alert' ? 'border-red-500 bg-red-50' : 'border-[#3498db] bg-white'
               } transition-all active:scale-[0.98]`}>
            
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{msg.sender}</h2>
              <span className="text-lg text-gray-500 font-mono">{msg.timestamp}</span>
            </div>

            {msg.status === 'scam_alert' ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-red-600 bg-red-100 p-4 rounded-xl">
                  <AlertTriangle size={36} className="shrink-0" />
                  <p className="text-2xl font-bold leading-tight">
                    AVÍS DE L'IAIA: Aquest missatge sembla una estafa. L'he bloquejat per seguretat.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <p className="text-[clamp(1.5rem,5vw,2rem)] leading-snug text-gray-800">
                  "{msg.originalText}"
                </p>
                {/* Botón Masivo de Escuchar (para accesibilidad/ancianos) */}
                <button className="flex items-center justify-center gap-4 bg-black text-white p-6 rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto">
                  <Volume2 size={40} />
                  <span className="text-3xl font-bold">Escoltar Missatge</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ActionBar Global: Botón gigantesco para hablar y responder */}
      <div className="p-6 bg-white border-t border-gray-200 sticky bottom-0">
         <button className="w-full flex items-center justify-center gap-6 bg-red-600 text-white p-8 rounded-3xl active:bg-red-700 shadow-[0_8px_0_rgb(185,28,28)] active:translate-y-2 active:shadow-none transition-all">
            <Mic size={48} className="animate-pulse" />
            <span className="text-4xl font-extrabold tracking-widest uppercase">Parlar</span>
         </button>
      </div>

    </div>
  );
};

export default TelephoneModule;
