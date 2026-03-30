'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// 클라이언트 컴포넌트 내부 로직
function NewsContent() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('¡ÚLTIMO MOMENTO!'); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const t = searchParams.get('t');
    if (t) {
      try {
        // 클라이언트 사이드 디코딩
        setTitle(decodeURIComponent(window.atob(t)));
      } catch (e) {
        console.error("Decoding error:", e);
      }
    }
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg sticky top-0 z-50">
        <span className="text-xl tracking-tighter">NOTICIARIO <span className="bg-white text-red-700 px-1 ml-1 font-black">BROMAS MX</span></span>
        <span className="animate-pulse text-sm flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2"></span> EN VIVO
        </span>
      </div>

      <div className="p-5 max-w-2xl mx-auto mt-4">
        <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest">
          EXCLUSIVA MUNDIAL
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8">
          {title}
        </h1>

        <div className="aspect-video w-full mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 relative">
           <img src="/thumbnail.png" alt="Noticia" className="w-full h-full object-cover" />
           <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
             IMÁGENES DEL MOMENTO
           </div>
        </div>

        <div className="space-y-6 text-gray-800 leading-relaxed text-lg">
          <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4">
            [CIUDAD DE MÉXICO] — ÚLTIMA HORA:
          </p>
          <p>
            Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en estado de shock absoluto. 
          </p>
          <p>
            Lo que inicialmente parecía un rumor aislado en redes sociales ha escalado a una crisis informativa sin precedentes. Se espera un comunicado oficial en las próximas horas.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-[9999]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-7xl mb-5">🤣</div>
            <h2 className="text-4xl font-black text-black mb-3 italic tracking-tighter">¡CAÍSTE!</h2>
            <p className="text-gray-700 mb-8 font-medium">Esta noticia es totalmente falsa. <br/>Fuiste troleado por un amigo.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              ¡QUIERO TROLEARE!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// export default는 반드시 Suspense로 감싸야 쿼리 파라미터를 읽을 때 빌드 에러가 안 납니다.
export default function ViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-red-600">Cargando noticia...</div>}>
      <NewsContent />
    </Suspense>
  );
}