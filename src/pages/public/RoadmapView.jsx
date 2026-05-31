
import { Sprout, Tractor, PackageCheck, Flame, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import UniversalPage from './UniversalPage';

import { roadmapData } from '../../data/roadmapData';

// Extracció ordenada i timeline grouping
const allTasks = [...roadmapData.production, ...roadmapData.done, ...roadmapData.dev, ...roadmapData.backlog].sort((a, b) => a.date.localeCompare(b.date));
const groupedByQuarter = allTasks.reduce((acc, task) => {
  if (!acc[task.date]) acc[task.date] = [];
  acc[task.date].push(task);
  return acc;
}, {});
const quarters = Object.keys(groupedByQuarter).sort();

 
const BoardColumn = ({ title, icon: Icon, items, colorClass }) => (
  <div className="flex-1 min-w-[320px] max-w-md w-full bg-[var(--bg-panel)] border border-[var(--border-master)] rounded-xl p-4 flex flex-col gap-4 contain-layout">
    <div className={`flex items-center gap-2 border-b-2 pb-3 mb-1 ${colorClass}`}>
      <Icon size={22} className="shrink-0" />
      <h2 className="text-xl font-bold uppercase m-0 leading-none">{title}</h2>
      <span className="ml-auto bg-[var(--text-main)]/10 px-2 py-0.5 rounded-full text-sm font-bold opacity-70">
        {items.length}
      </span>
    </div>
    
    <div className="flex flex-col gap-3 stable-scroll pb-2 z-token-base">
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
        <div key={item.id} className="universal-card hover:scale-[1.01] transition-transform cursor-default group relative overflow-hidden bg-[var(--bg-app)] border border-[var(--border-master)]">
          <div className="absolute top-0 left-0 w-1 h-full bg-[var(--theme-accent-primary)] opacity-50" />
          
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black tracking-widest uppercase opacity-60 flex items-center gap-1.5 line-clamp-1">
              <Calendar size={12} className="shrink-0" /> {item.date}
            </span>
            <div className="flex bg-[var(--theme-accent-primary)]/10 px-2 py-1 rounded gap-1 items-center">
              <Tag size={12} className="text-[var(--theme-accent-primary)] shrink-0" />
              <span className="text-[10px] uppercase font-bold text-[var(--theme-accent-primary)] text-center line-clamp-1 leading-none">{item.category}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 mt-1">
            <div className="p-2 bg-[var(--bg-panel)] rounded-[10px] border border-[var(--border-master)] shrink-0 mt-0.5 text-[var(--theme-accent-secondary)]">
              <ItemIcon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline">
                <h3 className="font-bold text-[1.05rem] leading-tight mb-2 text-[var(--text-main)] group-hover:text-[var(--theme-accent-primary)] transition-colors">{item.title}</h3>
              </Link>
              <p className="text-[13px] opacity-70 leading-snug m-0 text-[var(--text-muted)] text-pretty">
                {item.desc}
              </p>
            </div>
          </div>
        </div>
      )})}
    </div>
  </div>
);

const CalendarGanttView = () => (
  <div className="w-full h-full flex flex-col gap-8 md:gap-14 pb-12 align-top">
    {quarters.map((q) => (
      <div key={q} className="relative w-full flex flex-col md:flex-row gap-4 lg:gap-8 items-start group">
        
        {/* Timeline Axis (Q) */}
        <div className="md:w-32 lg:w-40 shrink-0 sticky top-0 md:top-4 z-10 bg-[var(--bg-panel)]/95 backdrop-blur-md md:bg-transparent py-2 border-b md:border-b-0 border-[var(--theme-accent-primary)] md:border-r-4 pr-4">
          <div className="flex p-3 rounded-lg md:rounded-none bg-transparent items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-[var(--theme-accent-primary)] -ml-2 shrink-0 md:block hidden outline outline-4 outline-[var(--bg-panel)] shadow-md" />
             <h3 className="font-black text-2xl tracking-tighter text-[var(--theme-accent-primary)] uppercase flex-1 text-left md:text-right m-0 flex items-center justify-start md:justify-end gap-2">
              <Calendar size={20} className="md:hidden" /> {q.replace('-', ' ')}
             </h3>
          </div>
        </div>

        {/* Task Nodes Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 lg:gap-6 mt-1 relativerounded-xl">
           
           {groupedByQuarter[q].map(item => {
              const ItemIcon = item.icon;
              const statusColor = roadmapData.production.some(d=>d.id===item.id)
                  ? "border-purple-500/40 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  : roadmapData.done.some(d=>d.id===item.id) 
                  ? "border-green-500/20 bg-green-500/5" 
                  : roadmapData.dev.some(d=>d.id===item.id) 
                  ? "border-blue-500/20 bg-blue-500/5" 
                  : "border-orange-500/20 bg-orange-500/5";

              return (
              <div key={item.id} className={`flex flex-col universal-card border-[2px] ${statusColor} hover:scale-[1.02] active:scale-[0.98] transition-transform bg-[var(--bg-panel)] relative overflow-hidden`}>
                 {roadmapData.production.some(d=>d.id===item.id) && (
                     <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-widest z-10 animate-pulse">
                         ACTIU
                     </div>
                 )}
                 <div className="flex items-center gap-3 border-b border-[var(--border-master)] pb-3">
                    <div className={`bg-[var(--bg-app)] p-2.5 rounded-[12px] shrink-0 border border-[var(--border-master)]`}>
                      <ItemIcon size={24} className="text-[var(--text-main)] opacity-70" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline">
                        <h4 className="font-bold text-[1.1rem] leading-tight m-0 text-[var(--text-main)]">{item.title}</h4>
                      </Link>
                      <div className="text-[10px] mt-1.5 font-black text-[var(--theme-accent-secondary)] uppercase tracking-widest">{item.category}</div>
                    </div>
                 </div>
                 <p className="text-[13px] opacity-80 mt-3 flex-1 flex items-start text-[var(--text-muted)] leading-relaxed font-medium">
                   {item.desc}
                 </p>
                 <div className="mt-4 pt-2 border-t border-[var(--border-master)] flex gap-2 overflow-hidden flex-wrap max-h-5 sm:max-h-screen">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[var(--text-muted)] line-clamp-1">{item.tags.join(' • ')}</span>
                 </div>
              </div>
           )})}
        </div>
      </div>
    ))}
  </div>
);

const ListView = () => (
    <div className="w-full max-w-4xl mx-auto pb-12 mt-4 text-[var(--text-main)]">
        {roadmapData.production.length > 0 && (
            <>
                <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-purple-500/90 border-b border-purple-500/20 pb-3 flex items-center gap-2">
                    <Flame size={24} /> En Producció
                </h2>
                <ul className="list-disc pl-6 mb-10 space-y-4">
                    {roadmapData.production.map(item => (
                        <li key={item.id}>
                            <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                        </li>
                    ))}
                </ul>
            </>
        )}

        <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-green-500/90 border-b border-green-500/20 pb-3 flex items-center gap-2">
            <PackageCheck size={24} /> Collita Tancada (Fet)
        </h2>
        <ul className="list-disc pl-6 mb-10 space-y-4">
            {roadmapData.done.map(item => (
                <li key={item.id}>
                    <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                </li>
            ))}
        </ul>

        <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-blue-500/90 border-b border-blue-500/20 pb-3 flex items-center gap-2">
            <Tractor size={24} /> Sementeres Vives (Beta)
        </h2>
        <ul className="list-disc pl-6 mb-10 space-y-4">
            {roadmapData.dev.map(item => (
                <li key={item.id}>
                    <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                </li>
            ))}
        </ul>

        <h2 className="text-[1.35rem] font-black uppercase tracking-widest mb-4 text-orange-500/90 border-b border-orange-500/20 pb-3 flex items-center gap-2">
            <Sprout size={24} /> Llavors (Totes les Idees)
        </h2>
        <ul className="list-disc pl-6 mb-10 space-y-4">
            {roadmapData.backlog.map(item => (
                <li key={item.id}>
                    <Link to={`/auditoria/llavor/${item.slug}`} className="hover:underline"><strong>{item.title}</strong></Link> ({item.date}) [{item.category}]: {item.desc}
                </li>
            ))}
        </ul>
    </div>
);


export const RoadmapView = () => {
  return (
    <UniversalPage 
        standAlone={true}
        forcedTitle="Les 40 Fites"
        forcedSubtitle="La Matriu de Llavors"
        forcedHeroImage="/assets/uploads/brain/thermodynamics_ai_hardware_1775882083812.png"
        defaultViewMode="document"
        renderKanban={() => (
           <div className="flex flex-col xl:flex-row gap-6 md:gap-8 items-start w-full relative overflow-x-auto custom-scrollbar pb-6 px-4 h-full">
            <BoardColumn title="En Producció" icon={Flame} items={roadmapData.production} colorClass="border-purple-500/30 text-purple-500 border-b-[3px]" />
            <BoardColumn title="Llavors (Tot)" icon={Sprout} items={roadmapData.backlog} colorClass="border-orange-500/20 text-orange-500/80 border-b-[3px]" />
            <BoardColumn title="Sementeres" icon={Tractor} items={roadmapData.dev} colorClass="border-blue-500/20 text-blue-500/80 border-b-[3px]" />
            <BoardColumn title="Fet" icon={PackageCheck} items={roadmapData.done} colorClass="border-green-500/20 text-green-500/80 border-b-[3px]" />
          </div>
        )}
        renderCalendar={() => <CalendarGanttView />}
    >
        <div className="mb-8">
            <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed mt-4 opacity-70 text-[var(--text-main)] text-pretty">
                L'auditoria històrica més gran del Mas fins avui. Totes les línies, idees y mecàniques burocràtiques o P2P que asseient l'abans i el després de <strong>Sóc de Poble</strong> cap al <span className="text-[var(--theme-accent-primary)] font-bold">Rescat de la Ruralitat</span> i la Sobirania Ciutadana.
            </p>
        </div>
        <ListView />
    </UniversalPage>
  );
};

export default RoadmapView;
