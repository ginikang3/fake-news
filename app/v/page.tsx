// app/v/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// 1. 실제 뉴스가 보이는 알맹이 (클라이언트 컴포넌트)
function NewsContent() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState<string>('Cargando noticia...');
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const t = searchParams.get('t');
    if (t) {
      try {
        setTitle(decodeURIComponent(atob(t)));
      } catch (e) {
        console.error("Error decoding title:", e);
      }
    }
    // 3초 뒤에 낚시 팝업 노출
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* 긴급 속보 헤더 */}
      <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg">
        <span className="text-xl">ÚLTIMA HORA</span>
        <span className="animate-pulse text-sm">● EN VIVO</span>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6 mt-4">
          {title}
        </h1>
        
        {/* 뉴스 썸네일 */}
        <div className="aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-100 shadow-md text-gray-400">
           {/* public/news-default.jpg가 있으면 보여주고 없으면 텍스트 노출 */}
           <img 
             src="/news-default.jpg" 
             alt="Noticia" 
             className="w-full h-full object-cover" 
             onError={(e: any) => e.target.style.display = 'none'}
           />
           <span className="absolute">MÉXICO EN VIVO</span>
        </div>

        <div className="space-y-5 text-gray-800 leading-relaxed text-lg">
          <p className="font-bold text-red-700">CIUDAD DE MÉXICO —</p>
          <p>Información confirmada hace unos minutos por las autoridades locales. El reporte indica que los hechos ocurrieron de manera inesperada.</p>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <p>Se recomienda a la población mantener la calma y esperar el comunicado oficial completo.</p>
        </div>
      </div>

      {/* 팝업 모달 (Z-index 높게) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-7xl mb-5">🤣</div>
            <h2 className="text-3xl font-black text-black mb-3 italic">¡CAÍSTE!</h2>
            <p className="text-gray-700 mb-8 font-medium text-lg leading-snug">
              Esta noticia es <span className="text-red-600 font-bold">100% FALSA</span>.<br/>Fuiste troleado por un amigo.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-all text-xl"
            >
              ¡QUIERO TROLEARE!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. 메인 페이지 (Suspense로 감싸서 빌드 에러 방지)
export default function ViewPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-black">Cargando...</div>}>
      <NewsContent />
    </Suspense>
  );
}