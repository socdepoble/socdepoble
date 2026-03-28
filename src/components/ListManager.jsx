import React, { useState } from 'react';
import { ListTodo, Plus, Trash2, X, Sparkles, CheckSquare, Square } from 'lucide-react';
import './ListManager.css';

const ListManager = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([
    { id: 1, text: "Preparar escriptures", done: true },
    { id: 2, text: "Anar a la notaria", done: false }
  ]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), text: newItem, done: false }]);
    setNewItem("");
  };

  const toggleItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="list-manager-overlay glass-premium animate-in flex items-center justify-center p-6 z-modal">
      <div className="list-card bg-[#111] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
        
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <ListTodo className="text-emerald-500" />
                <h2 className="text-xl font-black uppercase text-teal-400">Llista de Tràmit</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-[28px] transition-colors">
                <X />
            </button>
        </header>

        <div className="space-y-6">
            <input 
                type="text" 
                placeholder="Títol de la llista..."
                className="w-full bg-transparent border-b border-white/10 p-2 text-lg font-black uppercase outline-none focus:border-emerald-500/50 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <div className="items-list space-y-2 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                    <div key={item.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${item.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'} transition-all group`}>
                        <button onClick={() => toggleItem(item.id)}>
                            {item.done ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Square size={20} className="opacity-20" />}
                        </button>
                        <span className={`text-sm flex-1 ${item.done ? 'line-through opacity-40' : 'font-bold'}`}>
                            {item.text}
                        </span>
                        <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:text-red-500 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Nou element..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-[28px] p-3 text-xs font-bold outline-none"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                />
                <button onClick={addItem} className="p-3 bg-emerald-600 text-white rounded-[28px] hover:scale-105 active:scale-95 transition-all">
                    <Plus size={20} />
                </button>
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-emerald-600 text-white p-4 rounded-[28px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Sparkles size={16} /> Desar Llista
            </button>
        </div>
      </div>
    </div>
  );
};
import { CheckCircle2 } from 'lucide-react';
export default ListManager;
