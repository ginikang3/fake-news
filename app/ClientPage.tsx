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
  const [title, setTitle] = useState('¡ÚLTIMA HORA!');

  const t = searchParams.get('t');
  const i = searchParams.get('i');

  useEffect(() => {
    setMounted(true);
    if (t) {
      try {
        setTitle(window.atob(t));
      } catch {}
      const timer = setTimeout(() => setShowModal(true), 3500);
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
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        initialQuality: 0.7,
      });

      const fileName = `news_${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from('news-images')
        .upload(fileName, compressedFile, {
          contentType: 'image/jpeg',
        });

      if (error) {
        alert('Error al subir imagen');
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('news-images')
        .getPublicUrl(fileName);

      const encodedTitle = window.btoa(encodeURIComponent(inputTitle));

      setLink(
        `${window.location.origin}/?t=${encodedTitle}&i=${encodeURIComponent(publicUrl)}&v=${Date.now()}`
      );

    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // =========================
  // 📰 ARTICLE PAGE
  // =========================
  if (t) {
    return (
      <div className="min-h-screen bg-gray-100 text-black">

        {/* TOP BAR */}
        <header className="bg-red-600 text-white shadow-md">
          <div className="max-w-3xl mx-auto flex justify-between items-center px-4 py-3">
            <div className="font-black tracking-widest text-lg">
              NOTICIAS MX
            </div>
            <div className="text-xs font-bold animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              EN VIVO
            </div>
          </div>
        </header>

        {/* ARTICLE */}
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
                  className="w-full object-cover"
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <p className="text-red-600 font-bold mb-2 uppercase text-sm">
                  Informe exclusivo
                </p>

                <p className="text-gray-800 leading-relaxed text-lg">
                  Fuentes cercanas confirman que el evento ha generado una gran reacción en redes sociales.
                  La situación continúa desarrollándose y mantiene a la población en alerta.
                </p>
              </div>

            </div>

          </div>
        </main>

        {/* FAKE MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl">
              <div className="text-5xl mb-3">🤣</div>
              <h2 className="text-2xl font-black mb-2">¡CAÍSTE!</h2>
              <p className="text-gray-600 mb-5">Esta noticia es falsa.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-red-600 text-white w-full py-3 rounded-xl font-bold hover:bg-red-700"
              >
                Crear otra noticia
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================
  // 🛠 CREATOR PAGE
  // =========================
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-red-600">
            Generador de Noticias
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Crea una noticia viral en segundos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-bold text-gray-600">
              Título
            </label>
            <input
              name="title"
              placeholder="Ej: Cantante desaparece misteriosamente"
              className="w-full mt-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600">
              Imagen
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1 border rounded-xl p-3 bg-gray-50"
              required
            />
          </div>

          <button
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
          >
            {loading ? 'Generando...' : 'Crear noticia'}
          </button>

        </form>

        {link && (
          <div className="mt-6 bg-gray-50 border rounded-xl p-4 text-center">

            <p className="text-xs text-gray-500 mb-2">
              Enlace generado
            </p>

            <input
              value={link}
              readOnly
              className="w-full p-2 border rounded-lg text-sm mb-3"
            />

            <button
              onClick={() => handleCopy(link)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold w-full hover:bg-blue-700"
            >
              Copiar enlace
            </button>

          </div>
        )}

      </div>
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