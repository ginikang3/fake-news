'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export default function CreateBromaPage() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [mounted, setMounted] = useState(false);

  // Hydration 에러 방지 (클라이언트 전용 렌더링 확인)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert('¡Copiado con éxito!');
      } else {
        throw new Error('Fallback to execCommand');
      }
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡Copiado con éxito!');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const file = formData.get('image') as File;

    try {
      // 1. 이미지 압축 (안전하게 처리)
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      // 2. Supabase Storage 업로드
      const fileName = `news_${Date.now()}`;
      const { error: storageError } = await supabase.storage
        .from('news-images')
        .upload(fileName, compressedFile);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);

      // 3. DB 저장
      const { data, error: dbError } = await supabase
        .from('news_posts')
        .insert([{ title, image_url: publicUrl }])
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        // 클라이언트에서 안전하게 btoa(Base64) 사용
        const encodedTitle = btoa(encodeURIComponent(title));
        const generatedLink = `${window.location.origin}/?t=${encodedTitle}`; 
        setLink(generatedLink);
      }
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Error al procesar'));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-10 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-b-8 border-red-600">
        {/* 헤더 부분: 강렬한 빨간색 뉴스 바 */}
        <div className="bg-red-600 p-4 text-center">
          <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase">Noticiario Bromas MX</h1>
          <p className="text-red-100 text-[10px] font-bold">EDICIÓN ESPECIAL MÉXICO</p>
        </div>

        <div className="p-8">
          <p className="text-gray-600 text-sm mb-8 text-center leading-tight">
            Crea una noticia impactante y engaña a todos tus amigos en redes sociales.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-red-600 uppercase mb-2 ml-1">1. Escribe el Título</label>
              <input 
                name="title" 
                placeholder="Ej: ¡Bad Bunny en el Zócalo!" 
                className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-xl text-black font-bold outline-none focus:border-red-500 transition-all placeholder:text-gray-300"
                required 
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-red-600 uppercase mb-2 ml-1">2. Sube una Foto</label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                <input 
                  type="file" 
                  name="image" 
                  accept="image/*" 
                  className="w-full text-xs text-gray-500 file:hidden cursor-pointer"
                  required 
                />
                <p className="text-[10px] text-gray-400 text-center uppercase">Toca para seleccionar imagen</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-red-600 hover:bg-black text-white font-black py-5 rounded-xl shadow-lg transition-all active:scale-95 disabled:bg-gray-300 uppercase italic tracking-widest text-lg"
            >
              {loading ? 'Generando...' : '¡PUBLICAR NOTICIA!'}
            </button>
          </form>

          {link && (
            <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl animate-pulse-short">
              <p className="font-black text-yellow-900 text-xs mb-3 uppercase flex items-center">
                <span className="mr-2">🔥</span> ¡Link de la Trampa listo!
              </p>
              <input 
                readOnly 
                value={link} 
                className="w-full p-3 bg-white border border-yellow-300 rounded-lg text-[11px] text-gray-700 mb-4 focus:outline-none font-mono" 
              />
              <button 
                onClick={() => handleCopy(link)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-black py-3 rounded-lg uppercase shadow-md active:bg-blue-800 transition-all"
              >
                Copiar Link y engañar
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
        © 2026 Noticiario Bromas MX
      </p>
    </main>
  );
}