'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

/* =========================
   SAFE BASE64 HELPERS
========================= */
function encodeTitle(str: string) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function decodeTitle(str: string | null) {
  if (!str) return '¡ÚLTIMA HORA!';
  try {
    return decodeURIComponent(escape(window.atob(str)));
  } catch {
    return '¡ÚLTIMA HORA!';
  }
}

function NewsContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('¡ÚLTIMA HORA!');

  const t = searchParams.get('t');
  const i = searchParams.get('i');

  useEffect(() => {
    setMounted(true);

    if (t) {
      setTitle(decodeTitle(t));

      const timer = setTimeout(() => {
        setShowModal(true);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [t]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert('Enlace copiado');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const inputTitle = formData.get('title') as string;
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('Selecciona una imagen');
      setLoading(false);
      return;
    }

    try {
      // 1. 이미지 압축
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        initialQuality: 0.7,
      });

      // 2. Storage에 이미지 업로드
      const fileName = `news_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, compressedFile, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      // 3. 이미지 공용 URL 따오기
      const { data: urlData } = supabase.storage.from('news-images').getPublicUrl(fileName);
      const publicImageUrl = urlData.publicUrl;

      // 🔴 4. [핵심] DB에 제목과 이미지 주소 저장
      const { data: dbData, error: dbError } = await supabase
        .from('news_posts')
        .insert({
          title: inputTitle,
          image_url: publicImageUrl,
          is_caught: false
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 5. 결과값 설정 (2칸 분리 UI용)
      const origin = window.location.origin;
      setLink(
        `🔗 [사칭범에게 보낼 뉴스 링크]\n${origin}/news/${dbData.id}\n\n` +
        `📡 [실시간 위치 추적 대시보드]\n${origin}/track/${dbData.id}`
      );

    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  /* =========================
     ARTICLE PAGE (미리보기 모드 등)
  ========================= */
  if (t) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <header className="bg-red-600 text-white shadow-md">
          <div className="max-w-3xl mx-auto flex justify-between items-center px-4 py-3">
            <div className="font-black tracking-widest text-lg">NOTICIAS MX</div>
            <div className="text-xs font-bold animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              EN VIVO
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto p-4 mt-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5">
              <span className="inline-block bg-black text-white text-xs px-3 py-1 rounded-full mb-4">
                ÚLTIMA HORA
              </span>
              <h1 className="text-3xl md:text-4xl font-black leading-tight mb-5">
                {title}
              </h1>
              <div className="rounded-xl overflow-hidden shadow-md mb-6">
                <img
                  src={i ? decodeURIComponent(i) : "/thumbnail.png"}
                  alt="Preview"
                  className="w-full object-cover"
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="text-red-600 font-bold mb-2 text-sm uppercase">Informe exclusivo</p>
                <p className="text-gray-800 leading-relaxed text-lg">
                  Fuentes cercanas confirman que el evento ha generado una gran reaction en redes sociales.
                  La situación continúa desarrollándose.
                </p>
              </div>
            </div>
          </div>
        </main>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-3">🤣</div>
              <h2 className="text-2xl font-black mb-2">¡CAÍSTE!</h2>
              <p className="text-gray-600 mb-5">Esta noticia es falsa.</p>
              <button
                onClick={() => (window.location.href = '/')}
                className="bg-red-600 text-white w-full py-3 rounded-xl font-bold"
              >
                Crear otra noticia
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================
     CREATOR PAGE
  ========================= */
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-red-600">Generador de Noticias</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-600">Título</label>
            <input
              name="title"
              placeholder="Ej: Cantante desaparece misteriosamente"
              className="w-full mt-1 border border-gray-300 text-black placeholder-gray-400 bg-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600">Imagen</label>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1 border border-gray-300 text-black bg-white rounded-xl p-3"
              required
            />
          </div>
          <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">
            {loading ? 'Generando...' : 'Crear noticia'}
          </button>
        </form>

        {link && (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 1. 사칭범에게 보낼 링크 */}
            <div className="bg-white border-2 border-red-500 rounded-2xl p-5 shadow-lg relative">
              <div className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md">
                LINK PARA EL IMPOSTOR
              </div>
              <p className="text-xs font-bold text-gray-500 mb-2 italic">Copia y envía este enlace:</p>
              <input
                readOnly
                value={`${window.location.origin}/news/${link.split('/news/')[1]?.split('\n')[0]}`}
                className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-mono text-black mb-3 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(`${window.location.origin}/news/${link.split('/news/')[1]?.split('\n')[0]}`)}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition"
              >
                Copiar enlace de noticia
              </button>
            </div>

            {/* 2. 추적 대시보드 */}
            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-5 shadow-xl relative">
              <div className="absolute -top-3 left-4 bg-zinc-100 text-black text-[10px] font-black px-2 py-1 rounded shadow-md">
                TU PANEL DE RASTREO
              </div>
              <p className="text-xs font-black text-red-500 mb-1 animate-pulse">
                ⚠️ ATENCIÓN: No compartas este enlace con nadie
              </p>
              <p className="text-[10px] font-bold text-zinc-500 mb-2 italic">Rastreo en tiempo real:</p>
              <input
                readOnly
                value={`${window.location.origin}/track/${link.split('/track/')[1]}`}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-mono text-green-400 mb-3 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => window.open(`${window.location.origin}/track/${link.split('/track/')[1]}`, '_blank')}
                className="w-full bg-white text-black py-3 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition"
              >
                Abrir Rastreador
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🔴 여학생용 면책 조항 (악용 방지용) */}
      <footer className="mt-12 pb-6 text-center max-w-md px-4">
        <p className="text-[10px] text-gray-400 leading-tight">
          ⚠️ **Aviso de responsabilidad:** El uso de esta herramienta es responsabilidad exclusiva del usuario. 
          No nos hacemos responsables de cualquier daño o mal uso de la información recopilada.
        </p>
        <p className="text-[10px] text-gray-400 mt-2">
          (주의: 이 도구의 사용 책임은 전적으로 사용자에게 있으며, 수집된 정보의 악용으로 발생하는 피해에 대해 어떠한 책임도 지지 않습니다.)
        </p>
      </footer>
    </main>
  );
}

export default function ClientPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NewsContent />
    </Suspense>
  );
}