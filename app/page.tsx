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

  useEffect(() => {
    setMounted(true);
    if (t) {
      try {
        setTitle(decodeURIComponent(window.atob(t)));
      } catch (e) {
        console.error("Decoding error:", e);
      }
      // 3초 뒤 낚시 팝업 등장 로직 유지
      const timer = setTimeout(() => setShowModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [t]);

  // 제목 태그 업데이트
  useEffect(() => {
    if (t && title) document.title = title;
  }, [t, title]);

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

    try {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file!, options);
      const fileName = `news_${Date.now()}`;
      await supabase.storage.from('news-images').upload(fileName, compressedFile);
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
      await supabase.from('news_posts').insert([{ title: inputTitle, image_url: publicUrl }]);
      
      const encodedTitle = btoa(encodeURIComponent(inputTitle));
      setLink(`${window.location.origin}/?t=${encodedTitle}`);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // 🎣 [낚시 화면] URL에 ?t= 가 있을 때 (님이 주신 디자인 적용)
  if (t) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        {/* 뉴스 헤더 */}
        <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg sticky top-0 z-50">
          <span className="text-xl tracking-tighter uppercase">NOTICIARIO <span className="bg-white text-red-700 px-1 ml-1">BROMAS MX</span></span>
          <span className="animate-pulse text-sm flex items-center">
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span> EN VIVO
          </span>
        </div>

        <div className="p-5 max-w-2xl mx-auto mt-4">
          <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest">EXCLUSIVA MUNDIAL</div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8">{title}</h1>
          <div className="aspect-video w-full mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
             <img src="/thumbnail.png" alt="Noticia" className="w-full h-full object-cover" />
             <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">IMÁGENES DEL MOMENTO</div>
          </div>
          <div className="space-y-6 text-gray-800 leading-relaxed text-lg">
            <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4">[CIUDAD DE MÉXICO] — ÚLTIMA HORA:</p>
            <p>Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en estado de shock absoluto.</p>
          </div>
        </div>

        {/* 🤣 낚시 성공 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-[9999]">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="text-7xl mb-5">🤣</div>
              <h2 className="text-4xl font-black text-black mb-3 italic tracking-tighter uppercase">¡CAÍSTE!</h2>
              <p className="text-gray-700 mb-8 font-medium italic">"속았지? 병신아"<br/>(Broma realizada con éxito)</p>
              <button onClick={() => window.location.href = '/'} className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl">¡QUIERO TROLEARE!</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🛠️ [제작 화면] URL에 ?t= 가 없을 때
  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-b-8 border-red-600 p-8">
        <h1 className="text-2xl font-black text-center mb-6 text-red-600 italic">CREAR NOTICIA FALSA</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input name="title" placeholder="Ej: 멕시코 축구팀 해체!" className="w-full border-2 p-4 rounded-xl font-bold" required />
          <input type="file" name="image" accept="image/*" className="w-full text-sm" required />
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-black py-5 rounded-xl text-xl uppercase italic">
            {loading ? 'PUBLICANDO...' : '¡GENERAR LINK!'}
          </button>
        </form>
        {link && (
          <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl border-dashed text-black text-center font-bold">
            <p className="text-xs mb-2">🔥 ¡Link listo para la broma!</p>
            <input readOnly value={link} className="w-full p-2 border mb-3 text-[10px]" />
            <button onClick={() => handleCopy(link)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase">Copiar Link</button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CombinedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>}>
      <NewsContent />
    </Suspense>
  );
}