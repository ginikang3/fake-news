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

  const t = searchParams.get('t'); // 제목 파라미터
  const i = searchParams.get('i'); // 이미지 파라미터 👈 추가

  useEffect(() => {
    setMounted(true);
    if (t) {
      try {
        setTitle(decodeURIComponent(window.atob(t)));
      } catch (e) {
        console.error("Decoding error:", e);
      }
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
    const fileInput = e.currentTarget.elements.namedItem('image') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert('Por favor selecciona una imagen.');
      setLoading(false);
      return;
    }

    try {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const fileName = `news_${Date.now()}`;
      
      // 1. 이미지 스토리지 업로드
      await supabase.storage.from('news-images').upload(fileName, compressedFile);
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
      
      // 2. DB 인서트
      await supabase.from('news_posts').insert([{ title: inputTitle, image_url: publicUrl }]);
      
      // 3. 링크 생성 (제목과 이미지를 모두 파라미터에 포함)
      const encodedTitle = btoa(encodeURIComponent(inputTitle));
      const encodedImage = encodeURIComponent(publicUrl); // 👈 이미지 주소 인코딩
      
      // 🚀 핵심: URL 뒤에 i 파라미터로 이미지 주소를 붙여줌 (이래야 왓츠앱이 읽음)
      setLink(`${window.location.origin}/?t=${encodedTitle}&i=${encodedImage}`);
      
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // 🎣 [낚시 화면]
  if (t) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg sticky top-0 z-50">
          <span className="text-xl tracking-tighter uppercase">NOTICIARIO <span className="bg-white text-red-700 px-1 ml-1 font-black">BROMAS MX</span></span>
          <span className="animate-pulse text-sm flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span> EN VIVO
          </span>
        </div>
        <div className="p-5 max-w-2xl mx-auto mt-4">
          <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest">EXCLUSIVA MUNDIAL</div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8">{title}</h1>
          <div className="aspect-video w-full mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
             {/* 💡 썸네일 대신 님이 올린 실제 이미지(i)를 보여줌 */}
             <img src={i ? decodeURIComponent(i as string) : "/thumbnail.png"} alt="Noticia" className="w-full h-full object-cover" />
             <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">IMÁGENES DEL MOMENTO</div>
          </div>
          <div className="space-y-6 text-gray-800 leading-relaxed text-lg text-left">
            <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4">[CIUDAD DE MÉXICO] — ÚLTIMA HORA:</p>
            <p>Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en estado de shock absoluto.</p>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-[9999]">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="text-7xl mb-5">🤣</div>
              <h2 className="text-4xl font-black text-black mb-3 italic tracking-tighter uppercase">¡CAÍSTE!</h2>
              <p className="text-gray-700 mb-8 font-medium italic">"속았지? 병신아"<br/>(Broma realizada con éxito)</p>
              <button onClick={() => window.location.href = '/'} className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95">¡QUIERO TROLEARE!</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🛠️ [만드는 페이지]
  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 border-b-8 border-red-600">
        <h1 className="text-2xl font-black text-center mb-6 text-red-600 italic uppercase">Crear Noticia Falsa</h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Título de la noticia</label>
            <input name="title" placeholder="Ej: ¡Bad Bunny en México!" className="w-full border-2 p-4 rounded-xl font-bold outline-none focus:border-red-600" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Imagen de portada</label>
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 border-2 p-2 rounded-xl" 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-5 rounded-xl text-xl uppercase italic shadow-lg active:scale-95">
            {loading ? 'PUBLICANDO...' : '¡GENERAR LINK!'}
          </button>
        </form>
        {link && (
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl border-dashed text-black">
            <p className="text-[10px] font-bold text-yellow-800 mb-2 uppercase text-center">✅ Link listo (Cópialo y envíalo)</p>
            <input readOnly value={link} className="w-full p-2 border mb-3 text-[10px] bg-white rounded shadow-inner" />
            <button onClick={() => handleCopy(link)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase shadow-md active:bg-blue-700">Copiar Link</button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CombinedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center font-bold">Cargando...</div>}>
      <NewsContent />
    </Suspense>
  );
}