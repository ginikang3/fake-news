'use client';
import { useState, useEffect } from 'react';

export default function ClientSideModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 z-[9999]">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl text-black font-black">
        <div className="text-7xl mb-5 font-black">🤣</div>
        <h2 className="text-4xl font-black text-black mb-3 italic tracking-tighter uppercase font-black">¡CAÍSTE!</h2>
        <p className="text-gray-700 mb-8 font-medium font-black">Esta noticia es totalmente falsa. <br/>Fuiste troleado por un amigo.</p>
        <button onClick={() => window.location.href = '/'} className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl font-black uppercase font-black">¡QUIERO TROLEARE!</button>
      </div>
    </div>
  );
}