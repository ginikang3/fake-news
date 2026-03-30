import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

// 1. 카톡 봇이 읽어가는 썸네일 설정 (서버 사이드)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();

  if (!post) return { title: "Noticiario Bromas MX" };

  return {
    title: post.title,
    description: "¡ÚLTIMO MOMENTO! Haz clic para ver la noticia completa.",
    openGraph: {
      title: `[NOTICIA] ${post.title}`,
      description: "Información de última hora confirmada por fuentes oficiales.",
      images: [post.image_url],
      type: 'article',
    },
  };
}

// 2. 친구가 클릭했을 때 실제로 보는 화면
export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();

  if (!post) return <div className="p-10 text-center">Noticia no encontrada.</div>;

  return (
    <main className="min-h-screen bg-white">
      {/* 가짜 뉴스 헤더 */}
      <div className="bg-red-600 text-white p-2 text-center font-black italic">
        NOTICIARIO BROMAS MX - ÚLTIMO MOMENTO
      </div>

      <div className="max-w-2xl mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-black">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-6 pb-2 border-b">Publicado hace 2 minutos</div>
        
        <img src={post.image_url} alt="News" className="w-full h-auto mb-10 shadow-lg" />

        {/* 낚시 성공 메시지 (여기서 빵 터트리는 부분) */}
        <div className="bg-yellow-100 p-10 rounded-xl border-2 border-dashed border-yellow-500 text-center">
          <h2 className="text-4xl font-black text-red-600 mb-4 animate-bounce">
            ¡CAÍSTE CABRÓN! 🤡
          </h2>
          <p className="text-xl text-gray-800 font-bold mb-4">
            No te creas todo lo que ves en internet. 
          </p>
          <p className="text-gray-600 mb-8 text-sm italic">
            Esta noticia fue creada para bromear. Ahora es tu turno de engañar a alguien.
          </p>
          
          <a href="/" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition">
            Crear mi propia broma
          </a>
        </div>

        {/* 여기에 나중에 Monetag 광고 스크립트가 들어감 */}
        <div className="mt-10 p-5 bg-gray-50 text-center text-xs text-gray-400 border border-gray-100">
          PUBLICIDAD / ADVERTISEMENT
        </div>
      </div>
    </main>
  );
}