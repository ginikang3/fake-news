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
        // 기존의 Base64 디코딩 로직 유지
        setTitle(decodeURIComponent(atob(t)));
      } catch (e) {
        console.error(e);
      }
    }
    // 3초 뒤에 "너 낚였어" 모달 띄우기 (기존 유지)
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* 뉴스 상단 헤더: 더 뉴스 사이트처럼 변경 */}
      <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg sticky top-0 z-50">
        <span className="text-xl tracking-tighter">NOTICIARIO <span className="bg-white text-red-700 px-1 ml-1">BROMAS MX</span></span>
        <span className="animate-pulse text-sm flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2"></span> EN VIVO
        </span>
      </div>

      <div className="p-5 max-w-2xl mx-auto mt-4">
        {/* 긴급 속보 태그 */}
        <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest">
          EXCLUSIVA MUNDIAL
        </div>

        {/* 사용자가 생성한 낚시 제목 */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8">
          {title}
        </h1>

        {/* 썸네일 이미지 연결: /thumbnail.png 로 교체 */}
        <div className="aspect-video w-full mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 relative">
           <img 
             src="/thumbnail.png" 
             alt="Noticia de último momento" 
             className="w-full h-full object-cover" 
           />
           <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
             IMÁGENES DEL MOMENTO
           </div>
        </div>

        {/* 그럴싸한 뉴스 본문 내용 (지어낸 내용) */}
        <div className="space-y-6 text-gray-800 leading-relaxed text-lg">
          <p className="font-bold">
            <span className="text-red-700 mr-2">[CIUDAD DE MÉXICO]</span> 
            Fuentes de alto nivel han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en estado de shock absoluto. 
          </p>
          
          <p>
            Lo que inicialmente parecía un rumor aislado en redes sociales ha escalado a una crisis informativa sin precedentes. Expertos aseguran que las repercusiones de este evento se sentirán a nivel global durante los próximos meses.
          </p>

          <p className="italic text-gray-600 border-l-4 border-red-600 pl-4">
            &quot;Es una situación que nadie pudo predecir. Estamos verificando los detalles finales, pero la veracidad de los hechos es innegable&quot;, declaró un portavoz oficial.
          </p>

          <p>
            Hasta el momento, no se han reportado declaraciones oficiales de los principales involucrados, pero la incertidumbre reina entre la población. Manténgase en sintonía para más actualizaciones en vivo.
          </p>
        </div>
      </div>

      {/* 낚시 성공 모달 (기존 로직 유지) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 z-[9999]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-110 transition-all">
            <div className="text-7xl mb-5">🤣</div>
            <h2 className="text-3xl font-black text-black mb-3 italic">¡CAÍSTE!</h2>
            <p className="text-gray-700 mb-8 font-medium">Esta noticia es falsa. Fuiste troleado con éxito por un amigo.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-lg transition-colors"
            >
              ¡QUIERO TROLEARE!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-red-600">Cargando noticia...</div>}>
      <NewsContent />
    </Suspense>
  );
}