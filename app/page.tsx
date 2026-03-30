// app/page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState<string>('');
  const [generatedUrl, setGeneratedUrl] = useState<string>('');

  const handleGenerate = () => {
    if (!title) return alert("¡Escribe un título impactante!");
    // Base64 인코딩 (스페인어/한글 깨짐 방지)
    const encodedTitle = btoa(encodeURIComponent(title));
    const url = `${window.location.origin}/v?t=${encodedTitle}`;
    setGeneratedUrl(url);
  };

  return (
    // 전체 배경 흰색으로 고정
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-black">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden border-t-8 border-red-600">
        <div className="p-8">
          <h1 className="text-3xl font-black text-center text-gray-900 mb-2">
            NOTICIARIO BROMAS 🇲🇽
          </h1>
          <p className="text-sm text-center text-gray-600 mb-8 font-medium">
            Crea una noticia falsa y trolea a tus amigos
          </p>

          <div className="space-y-6">
            {/* 입력창 배경 흰색, 글씨 검은색으로 고정 */}
            <input 
              type="text" 
              placeholder="Ej: ¡BTS viene a México mañana!" 
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none transition-all text-lg bg-white text-black placeholder:text-gray-400"
              onChange={(e: any) => setTitle(e.target.value)}
            />
            
            <button 
              onClick={handleGenerate}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all text-2xl"
            >
              GENERAR LINK 🔗
            </button>
          </div>

          {generatedUrl && (
            <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-xs font-bold text-yellow-800 mb-2 uppercase">¡LINK LISTO! Cópialo:</p>
              {/* 결과창 배경 흰색, 글씨 검은색으로 고정 */}
              <input 
                readOnly 
                value={generatedUrl} 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm mb-3 outline-none text-black"
                onClick={(e: any) => e.target.select()}
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedUrl);
                  alert("¡Copiado! Pégalo en WhatsApp 😈");
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-md"
              >
                COPIAR PARA TROLEO
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-8 text-gray-400 text-[10px] text-center uppercase tracking-widest">
        Solo para fines de entretenimiento
      </p>
    </div>
  );
}