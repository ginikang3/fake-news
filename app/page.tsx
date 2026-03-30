'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export default function CreateBromaPage() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('¡Copiado con éxito!');
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡Copiado!');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const file = (e.currentTarget.elements.namedItem('image') as HTMLInputElement).files?.[0];

    if (!file) {
      alert('Por favor, selecciona una imagen.');
      setLoading(false);
      return;
    }

    try {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      const fileName = `news_${Date.now()}`;
      const { error: storageError } = await supabase.storage.from('news-images').upload(fileName, compressedFile);
      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);

      const { data, error: dbError } = await supabase.from('news_posts').insert([{ title, image_url: publicUrl }]).select().single();
      if (dbError) throw dbError;

      if (data) {
        const encodedTitle = btoa(encodeURIComponent(title));
        setLink(`${window.location.origin}/?t=${encodedTitle}`);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-b-8 border-red-600">
        <div className="bg-red-600 py-6 px-4 text-center">
          <h1 className="text-white text-3xl font-black italic uppercase tracking-tighter shadow-sm">Noticiario MX</h1>
          <p className="text-red-100 text-[10px] font-bold mt-1 tracking-[0.2em]">GENERADOR DE BROMAS V.2</p>
        </div>

        <div className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase mb-2 ml-1">1. Título de la Noticia</label>
              <input 
                name="title" 
                placeholder="Ej: ¡Bad Bunny se retira!" 
                className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-xl text-black font-extrabold outline-none focus:border-red-600 transition-all shadow-inner" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase mb-2 ml-1">2. Foto de Portada</label>
              <div className="bg-gray-50 border-2 border-gray-100 p-4 rounded-xl shadow-inner">
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  className="w-full text-sm text-gray-600 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                  required 
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 ml-1">* Elige una foto que parezca real</p>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-red-600 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:bg-gray-400 uppercase italic tracking-wider text-xl"
            >
              {loading ? 'PUBLICANDO...' : '¡CREAR NOTICIA!'}
            </button>
          </form>

          {link && (
            <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl border-dashed">
              <p className="text-[11px] font-black text-yellow-800 mb-3 uppercase flex items-center">
                <span className="text-lg mr-2">🔗</span> Link de la Trampa:
              </p>
              <input 
                readOnly 
                value={link} 
                className="w-full p-3 bg-white border border-yellow-300 rounded-xl text-[10px] text-gray-700 mb-4 focus:outline-none font-mono" 
              />
              <button 
                onClick={() => handleCopy(link)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-black py-4 rounded-xl uppercase shadow-md active:bg-blue-800 transition-all"
              >
                Copiar Link
              </button>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center opacity-50">
        © 2026 Noticiario Bromas MX<br/>Hecho para el entretenimiento
      </footer>
    </main>
  );
}