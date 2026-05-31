import React from 'react';
import { usePostsStore } from '../../domain/posts/usePostsStore';
import { removeMutation, resetMutationFailed } from '../../data/offline/mutation-queue';

export default function ConflictBanner() {
  const posts = usePostsStore((state) => state.posts);
  const conflicts = posts.filter((post) => post.hasConflict);

  if (conflicts.length === 0) return null;

  return (
    <div 
      className="bg-[#3A0A0A] border-[3px] border-[#FF4444] rounded-xl p-5 mb-6 shadow-2xl"
      role="alert" 
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-white font-black text-xl flex items-center gap-2">
          <svg className="w-7 h-7 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sincronització interrompuda
        </h3>
        <p className="text-[#FFE5E5] text-[17px] font-semibold leading-relaxed">
          {conflicts.length === 1 
            ? "Tens 1 publicació que no s'ha pogut enviar per un conflicte amb el servidor." 
            : `Tens ${conflicts.length} publicacions que no s'han pogut enviar per un conflicte.`}
        </p>
        <div className="mt-3 flex flex-col gap-4">
          {conflicts.map((post) => (
            <div key={post.uuid} className="bg-black/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-[#FF4444]/30">
              <p className="text-[16px] text-[#F3F4F6] line-clamp-2 flex-1 block font-medium w-full">
                "{post.content}"
              </p>
              <div className="flex gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <button 
                  className="flex-1 sm:flex-none min-h-[48px] px-5 py-2 bg-[#D12828] hover:bg-[#E53E3E] text-white text-[16px] font-bold rounded-xl transition-colors border border-[#FF8888] focus:ring-[4px] focus:ring-[#FF8888] focus:outline-none"
                  aria-label={`Reintentar enviar publicació: ${post.content?.substring(0, 20)}`}
                  onClick={async () => {
                    if (post.uuid) {
                      await resetMutationFailed(post.uuid);
                      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({ type: 'SYNC_MUTATIONS' });
                      }
                    }
                  }}
                >
                  Reintentar
                </button>
                <button
                  className="flex-1 sm:flex-none min-h-[48px] px-5 py-2 bg-transparent border-[2.5px] border-[#9CA3AF] text-[#F3F4F6] hover:text-white hover:border-white text-[16px] font-bold rounded-xl transition-colors focus:ring-[4px] focus:ring-white focus:outline-none m3-touch-target"
                  aria-label={`Descartar publicació fallida: ${post.content?.substring(0, 20)}`}
                  onClick={async () => {
                    try {
                      if (post.uuid) await removeMutation(post.uuid);
                      usePostsStore.getState().removePost(post.uuid);
                    } catch (err) {
                      console.error('Fallo atómico al descartar mutación', err);
                    }
                  }}
                >
                  Descartar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
