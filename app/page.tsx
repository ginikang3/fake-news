'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

function NewsContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('¡ÚLTIMO MOMENTO!');

  const t = searchParams.get('t');
  const i = searchParams.get('i');

  useEffect(() => {
    setMounted(true);
    if (t) {
      try {
        setTitle(decodeURIComponent(window.atob(t)));
      } catch (e) { console.error(e); }
      const timer = setTimeout(() => setShowModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [t]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('¡Copiado!');
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
    const inputTitle = formData.get('title') as string;
    const file = (e.currentTarget.elements.namedItem('image') as HTMLInputElement).files?.[0];

    if (!file) {
      alert('Selecciona una imagen.');
      setLoading(false);
      return;
    }

    try {
      const compressedFile = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 800 });
      const fileName = `news_${Date.now()}`;
      await supabase.storage.from('news-images').upload(fileName, compressedFile);
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
      
      const encodedTitle = window.btoa(encodeURIComponent(inputTitle));
      setLink(`${window.location.origin}/?t=${encodedTitle}&i=${encodeURIComponent(publicUrl)}&v=${Date.now()}`);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (t) {
    return (
      <div className="min-h-screen bg-white text-black font-sans text-left">
        <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg sticky top-0 z-50">
          <span className="text-xl tracking-tighter uppercase font-black">NOTICIARIO <span className="bg-white text-red-700 px-1 ml-1 font-black">BROMAS MX</span></span>
          <span className="animate-pulse text-sm flex items-center font-bold font-black"><span className="w-2 h-2 bg-white rounded-full mr-2"></span> EN VIVO</span>
        </div>
        <div className="p-5 max-w-2xl mx-auto mt-4 text-left">
          <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest text-left">EXCLUSIVA MUNDIAL</div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8 text-left">{title}</h1>
          <div className="aspect-video w-full mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
             <img src={i ? decodeURIComponent(i as string) : "/thumbnail.png"} alt="Noticia" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6 text-gray-800 leading-relaxed text-lg text-left">
            <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4 text-left">[CIUDAD DE MÉXICO] — ÚLTIMA HORA:</p>
            <p className="text-left">Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en estado de shock absoluto.</p>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-[9999]">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl text-black">
              <div className="text-7xl mb-5 font-black">🤣</div>
              <h2 className="text-4xl font-black text-black mb-3 italic tracking-tighter uppercase font-black">¡CAÍSTE!</h2>
              <p className="text-gray-700 mb-8 font-medium">Esta noticia es totalmente falsa. <br/>Fuiste troleado por un amigo.</p>
              <button onClick={() => window.location.href = '/'} className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl font-black uppercase">¡QUIERO TROLEARE!</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-left">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 border-b-8 border-red-600">
        <h1 className="text-2xl font-black text-center mb-6 text-red-600 italic uppercase font-black">Crear Noticia Falsa</h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="text-left">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título de la noticia</label>
            <input name="title" placeholder="Ej: 멕시코 축구팀 해체!" className="w-full border-2 p-4 rounded-xl font-bold outline-none focus:border-red-600 bg-white" required />
          </div>
          <div className="text-left">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Imagen de portada</label>
            <input type="file" name="image" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border-2 p-2 rounded-xl bg-white text-left" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-5 rounded-xl text-xl uppercase italic shadow-lg active:scale-95 font-black uppercase">
            {loading ? 'PUBLICANDO...' : '¡GENERAR LINK!'}
          </button>
        </form>
        {link && (
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl border-dashed">
            <p className="text-[10px] font-bold text-yellow-800 mb-2 uppercase text-left font-black">✅ Link listo:</p>
            <input readOnly value={link} className="w-full p-2 border mb-3 text-[10px] bg-white text-black font-black" />
            <button onClick={() => handleCopy(link)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase shadow-md font-black uppercase">Copiar Link</button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CombinedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-black">Cargando...</div>}>
      <NewsContent />
    </Suspense>
  );
}