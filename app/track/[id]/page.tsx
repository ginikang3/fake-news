'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TrackPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();
      if (post) setData(post);
    };
    fetchData();

    // 실시간 구독: 사칭범이 클릭해서 DB가 바뀌면 바로 화면 업데이트
    const channel = supabase.channel(`track-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'news_posts', filter: `id=eq.${id}` }, 
      (payload) => setData(payload.new))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-black italic">CARGANDO...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-md border-4 border-red-600 p-8 rounded-3xl bg-zinc-900 shadow-[0_0_50px_rgba(220,38,38,0.4)] text-center">
        <h1 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Panel de Control de Víctima</h1>
        
        {!data.is_caught ? (
          <div className="py-10 animate-pulse text-zinc-500 font-bold uppercase">📡 Esperando que el pendejo caiga...</div>
        ) : (
          <div className="space-y-6 text-left animate-in zoom-in duration-300">
            <div className="bg-red-600 text-white p-3 text-center font-black rounded-lg animate-bounce">¡PÁJARO EN MANO! 🎯</div>
            <div className="space-y-2 font-mono text-sm">
              <p className="border-b border-zinc-800 pb-2 flex justify-between"><span className="text-zinc-500">IP:</span> <span className="text-red-500 font-bold">{data.ip}</span></p>
              <p className="border-b border-zinc-800 pb-2 flex justify-between"><span className="text-zinc-500">PAÍS:</span> <span>{data.country}</span></p>
              <p className="border-b border-zinc-800 pb-2 flex justify-between"><span className="text-zinc-500">CIUDAD:</span> <span>{data.city}</span></p>
            </div>
            <button onClick={() => window.open(`https://www.google.com/maps?q=${data.lat},${data.lon}`, '_blank')}
              className="w-full bg-blue-600 py-4 rounded-xl font-black hover:bg-blue-700">VER EN MAPA REAL</button>
          </div>
        )}
      </div>
    </div>
  );
}