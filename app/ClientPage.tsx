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
  const i = searchParams.get('i');

  useEffect(() => {
    setMounted(true);
    if (t) {
      try {
        setTitle(decodeURIComponent(window.atob(t)));
      } catch (e) { console.error(e); }
      const timer = setTimeout(() => setShowModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [t]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('¡Copiado!');
    } catch {
      alert('Error al copiar');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const inputTitle = formData.get('title') as string;
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('Selecciona una imagen.');
      setLoading(false);
      return;
    }

    try {
      // ✅ 압축 약간 완화 (WhatsApp 대응)
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
      });

      const fileName = `news_${Date.now()}.jpg`;

      // ✅ 핵심 수정: contentType 추가
      const { error: uploadError } = await supabase
        .storage
        .from('news-images')
        .upload(fileName, compressedFile, {
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase
        .storage
        .from('news-images')
        .getPublicUrl(fileName);

      const encodedTitle = window.btoa(encodeURIComponent(inputTitle));

      setLink(
        `${window.location.origin}/?t=${encodedTitle}&i=${encodeURIComponent(publicUrl)}&v=${Date.now()}`
      );

    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (t) {
    return (
      <div className="min-h-screen bg-white text-black font-sans">
        <h1 className="text-3xl font-black p-5">{title}</h1>
        <img
          src={i ? decodeURIComponent(i) : "/thumbnail.png"}
          className="w-full max-w-2xl mx-auto"
        />

        {showModal && (
          <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
            <div className="bg-white text-black p-6 rounded-xl text-center">
              <h2 className="text-3xl font-black">¡CAÍSTE!</h2>
              <button onClick={() => window.location.href = '/'}>
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Título" required />
        <input type="file" accept="image/*" required />
        <button>{loading ? '...' : 'Generar'}</button>
      </form>

      {link && (
        <div>
          <input value={link} readOnly />
          <button onClick={() => handleCopy(link)}>Copiar</button>
        </div>
      )}
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