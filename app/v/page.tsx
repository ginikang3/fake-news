'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function NewsContent() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('Cargando noticia...');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const t = searchParams.get('t');
    if (t) {
      try {
        setTitle(decodeURIComponent(atob(t)));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg">
        <span className="text-xl">ÚLTIMA HORA</span>
        <span className="animate-pulse text-sm">● EN VIVO</span>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6 mt-4">{title}</h1>
        <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-100 shadow-md text-gray-400 relative">
           <img src="/news-default.jpg" alt="Noticia" className="w-full h-full object-cover" />
           <span className="absolute">MÉXICO EN VIVO</span>
        </div>
        <div className="space-y-5 text-gray-800 leading-relaxed text-lg italic">
          <p>Información de último minuto desde la Ciudad de México...</p>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-7xl mb-5">🤣</div>
            <h2 className="text-3xl font-black text-black mb-3 italic">¡CAÍSTE!</h2>
            <p className="text-gray-700 mb-8 font-medium">Esta noticia es falsa. Fuiste troleado.</p>
            <button onClick={() => window.location.href = '/'} className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl">¡QUIERO TROLEARE!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NewsContent />
    </Suspense>
  );
}