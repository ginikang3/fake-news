// app/v/NewsContent.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewsContent() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState<string>('Cargando noticia...');
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const t = searchParams.get('t');
    if (t) {
      try { 
        setTitle(decodeURIComponent(atob(t))); 
      } catch (e) { 
        console.error(e); 
      }
    }
    // 3초 뒤에 낚시 팝업 노출
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 긴급 속보 헤더 */}
      <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg">
        <span className="text-xl">ÚLTIMA HORA</span>
        <span className="animate-pulse text-sm">● EN VIVO</span>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6 mt-4">
          {title}
        </h1>
        
        {/* 기본 뉴스 썸네일 */}
        <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-100 shadow-md">
           <img src="/news-default.jpg" alt="Noticia" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-5 text-gray-800 leading-relaxed text-lg">
          <p className="font-bold text-red-700 text-xl">CIUDAD DE MÉXICO —</p>
          <p>Información confirmada hace unos minutos por las autoridades locales. El reporte indica que los hechos ocurrieron de manera inesperada.</p>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <p>Se recomienda a la población mantener la calma y esperar el comunicado oficial completo que se emitirá en breve.</p>
        </div>
      </div>

      {/* 팝업 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-7xl mb-5">🤣</div>
            <h2 className="text-3xl font-black text-black mb-3 italic">¡CAÍSTE!</h2>
            <p className="text-gray-700 mb-8 font-medium text-lg leading-snug">
              Esta noticia es <span className="text-red-600 font-bold text-xl">100% FALSA</span>.<br/>Fuiste troleado por un amigo.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all text-xl active:scale-95"
            >
              ¡QUIERO TROLEARE!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}