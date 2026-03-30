'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export default function CreateBromaPage() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [mounted, setMounted] = useState(false);

  // Hydration 에러 방지용
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async (text: string) => {
    try {
      // 1. 현대적인 방식 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert('¡Copiado con éxito!');
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (err) {
      // 2. 구형 방식 (IP 접속이나 보안 환경 아닐 때 대비)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('¡Copiado con éxito!');
      } catch (e) {
        alert('Error al copiar. Por favor, copia manualmente.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const file = formData.get('image') as File;

    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 800 });
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: storageError } = await supabase.storage
        .from('news-images')
        .upload(fileName, compressedFile);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);

      const { data, error: dbError } = await supabase
        .from('news_posts')
        .insert([{ title, image_url: publicUrl }])
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        const encodedTitle = Buffer.from(title).toString('base64');
        const generatedLink = `${window.location.origin}/?t=${encodedTitle}`; 
        setLink(generatedLink);
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden border-t-4 border-red-600">
        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase italic text-center">Noticiario Bromas MX</h1>
          <p className="text-xs text-gray-500 mb-6 border-b pb-4 text-center font-bold">⚠️ SOLO PARA FINES DE ENTRETENIMIENTO</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Título de la Noticia</label>
              <input 
                name="title" 
                placeholder="Ej: ¡Christian Nodal se retira!" 
                className="w-full border-2 border-gray-100 p-3 rounded text-black outline-none focus:border-red-500"
                required 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Imagen de Portada</label>
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-red-600 file:text-white file:font-bold hover:file:bg-red-700 cursor-pointer"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-black text-white font-black py-4 rounded shadow-lg active:scale-95 disabled:bg-gray-400 uppercase tracking-tighter"
            >
              {loading ? 'GENERANDO...' : '¡CREAR NOTICIA AHORA!'}
            </button>
          </form>

          {link && (
            <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded">
              <p className="font-black text-yellow-800 text-[10px] mb-2 uppercase">✅ ¡Link generado!</p>
              <input 
                readOnly 
                value={link} 
                className="w-full p-2 border bg-white rounded text-[10px] text-gray-600 mb-3 focus:outline-none" 
              />
              <button 
                onClick={() => handleCopy(link)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 rounded uppercase"
              >
                COPIAR LINK
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}