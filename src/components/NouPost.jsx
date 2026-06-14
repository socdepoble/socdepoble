// src/components/NouPost.jsx
import React, { useState } from 'react';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db, storage } from '../firebase';
// import { useCharacters } from '../contexts/CharacterStateContext';
import { z } from 'zod';
// Sense framer-motion per ser immortal

// Mock lucide-react icons
const Upload = () => <span>📤</span>;
const X = () => <span>❌</span>;
const Tractor = () => <span>🚜</span>;
const PostSchema = z.object({
  type: z.enum(['post', 'market']),
  title: z.string().min(5, "El títol ha de tenir almenys 5 caràcters"),
  content: z.string().min(10, "Conta'ns alguna cosa amb més ànima"),
  price: z.number().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).max(6, "Màxim 6 etiquetes")
});
const NouPost = () => {
  const [type, setType] = useState('post');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    price: '',
    category: 'altres',
    tags: []
  });
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Mocking characters trigger
  const trigger = (char, anim) => {};
  const handleImageSelect = e => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 6)); // màxim 6 imatges
  };
  const removeImage = index => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  const uploadImages = async () => {
    // Mock upload
    const urls = [];
    setUploadProgress(new Array(images.length).fill(0));
    for (let i = 0; i < images.length; i++) {
      // Simulate progress
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 200));
        setUploadProgress(prev => {
          const newProgress = [...prev];
          newProgress[i] = p;
          return newProgress;
        });
      }
      urls.push(`mock-url-${i}.jpg`);
    }
    return urls;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      const validated = PostSchema.parse({
        ...formData,
        price: formData.price ? Number(formData.price) : undefined,
        tags: formData.tags
      });
      setIsUploading(true);
      trigger('ciberReme', 'excited');
      const imageUrls = await uploadImages();

      // Mock save to db

      trigger('iaiaMaria', 'serveCoca');

      // Reset form
      setFormData({
        title: '',
        content: '',
        price: '',
        category: 'altres',
        tags: []
      });
      setImages([]);
      setUploadProgress([]);
      alert("¡Publicat al Mas! La IAIA està orgullosa de tu.");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      }
      trigger('ciberReme', 'panic');
    } finally {
      setIsUploading(false);
    }
  };
  return <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border-2 border-orange-400 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Background Bruguera Touch */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Tractor />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-4xl">🌾</div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800">Posa alguna cosa al Mas</h1>
            <p className="text-slate-500">Que la iaia MarIA et mira amb orgull</p>
          </div>
        </div>

        {/* Selector Tipus */}
        <div className="flex gap-4 mb-8">
          <button type="button" onClick={() => setType('post')} className={`flex-1 py-4 rounded-2xl font-black transition-all ${type === 'post' ? 'bg-orange-500 text-white' : 'border border-orange-300 text-slate-600'}`}>
            📢 Al Mur
          </button>
          <button type="button" onClick={() => setType('market')} className={`flex-1 py-4 rounded-2xl font-black transition-all ${type === 'market' ? 'bg-orange-500 text-white' : 'border border-orange-300 text-slate-600'}`}>
            🛒 Al Mercat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div>
            <label className="block text-sm font-black mb-2 text-slate-700">Títol o Nom del Trasto</label>
            <input type="text" value={formData.title} onChange={e => setFormData({
            ...formData,
            title: e.target.value
          })} className="w-full p-4 rounded-2xl border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" placeholder={type === 'post' ? "Què ha passat hui al poble?" : "Tractor John Deere 1978 (funciona quan vol)"} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-black mb-2 text-slate-700">Conta'ns la història</label>
            <textarea value={formData.content} onChange={e => setFormData({
            ...formData,
            content: e.target.value
          })} rows={6} className="w-full p-4 rounded-3xl border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-y" placeholder="La meua iaia deia que..." />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {type === 'market' && <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black mb-2 text-slate-700">Preu (o "Intercanvi")</label>
                <input type="text" value={formData.price} onChange={e => setFormData({
              ...formData,
              price: e.target.value
            })} className="w-full p-4 rounded-2xl border border-orange-200 outline-none focus:border-orange-500" placeholder="50 o intercanvi" />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 text-slate-700">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({
              ...formData,
              category: e.target.value
            })} className="w-full p-4 rounded-2xl border border-orange-200 outline-none focus:border-orange-500 bg-white">
                  <option value="eines">Eines i Trastos</option>
                  <option value="aliments">Aliments i Verdures</option>
                  <option value="animals">Animals del Mas</option>
                  <option value="tecnologia_rural">Tecnologia Rural</option>
                </select>
              </div>
            </div>}

          {/* Pujada d'Imatges */}
          <div>
            <label className="block text-sm font-black mb-3 text-slate-700">Fotos del Trasto o Moment</label>
            <div className="border-2 border-dashed border-orange-300 rounded-3xl p-8 text-center bg-orange-50/30 hover:bg-orange-50 transition-colors">
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" id="upload" />
              <label htmlFor="upload" className="cursor-pointer flex flex-col items-center">
                <div className="text-4xl mb-2"><Upload /></div>
                <span className="font-medium text-slate-600">Pujar fotos (màxim 6)</span>
              </label>
            </div>

            {images.length > 0 && <div className="mt-6 space-y-4">
                {images.map((file, i) => <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                      <div className="text-sm truncate text-slate-700 font-medium">{file.name}</div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all duration-300" style={{ width: `${uploadProgress[i] || 0}%` }} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeImage(i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                      <X />
                    </button>
                  </div>)}
              </div>}
          </div>

          <button type="submit" disabled={isUploading} className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xl rounded-3xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-md">
            {isUploading ? "Pujant al Mas... Reme està suant" : "Publicar al Mas"}
            {!isUploading && <Tractor />}
          </button>
        </form>
      </div>
    </div>;
};
export default NouPost;