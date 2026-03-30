'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export default function CreateBromaPage() {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async (text: string) => {
    // 기존 복사 로직 유지...
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      alert('¡Copiado!');
    } else {
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
    const title = formData.get('title') as string;
    const file = formData.get('image') as File;

    if (!file || file.size === 0) {
      alert('Por favor selecciona una imagen válida.');
      setLoading(false);
      return;
    }

    try {
      // 1. 이미지 압축 (안전장치 추가)
      let finalFile: File | Blob = file;
      try {
        const options = { 
          maxSizeMB: 0.2, 
          maxWidthOrHeight: 800,
          useWebWorker: true // 속도 향상 및 로드 에러 방지
        };
        finalFile = await imageCompression(file, options);
      } catch (compressionError) {
        console.error('Compression failed, using original', compressionError);
        // 압축 실패 시 원본 그대로 진행 (에러 방지)
        finalFile = file;
      }

      // 2. 스토리지 업로드
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const { error: storageError } = await supabase.storage
        .from('news-images')
        .upload(fileName, finalFile);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);

      // 3. DB 저장
      const { data, error: dbError } = await supabase
        .from('news_posts')
        .insert([{ title, image_url: publicUrl }])
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        const encodedTitle = Buffer.from(title).toString('base64');
        const generatedLink = `${window.location.origin}/?t=${encodedTitle}`; 
        setLink(generatedLink);
      }
    } catch (err: any) {
      // 에러 메시지를 더 구체적으로 표시
      alert('Error: ' + (err.message || 'Load failed'));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* ... 나머지 UI 코드는 동일 ... */}
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden border-t-4 border-red-600 p-6">
        <h1 className="text-2xl font-black text-center mb-6 italic">NOTICIARIO BROMAS MX</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
           <input name="title" placeholder="Título de la noticia" className="w-full border p-3 rounded text-black" required />
           <input type="file" name="image" accept="image/*" className="w-full text-sm" required />
           <button type="submit" disabled={loading} className="w-full bg-red-600 text-white font-bold py-4 rounded">
             {loading ? 'GENERANDO...' : '¡CREAR NOTICIA!'}
           </button>
        </form>
        {link && (
          <div className="mt-6 p-4 bg-green-50 rounded border border-green-200">
             <input readOnly value={link} className="w-full p-2 text-xs border mb-2" />
             <button onClick={() => handleCopy(link)} className="w-full bg-blue-600 text-white py-2 rounded text-sm font-bold">COPIAR LINK</button>
          </div>
        )}
      </div>
    </main>
  );
}