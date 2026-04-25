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
          <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4 text-left font-black">
            [CIUDAD DE MÉXICO] — ÚLTIMA HORA:
          </p>
          <p className="text-left font-black italic">
            Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional en shock. La situación continúa en desarrollo y se espera un comunicado oficial en breve.
          </p>

          <div className="mt-12 py-10 border-t-2 border-dashed border-gray-200 text-center">
            <h2 className="text-4xl mb-4">🤣</h2>
            <p className="text-2xl font-black text-red-600 mb-2 uppercase">
              ¡ESTA NOTICIA ES FALSA!
            </p>
            <p className="text-lg font-bold text-gray-700">
              ¡Has caído en la broma!
            </p>
            <p className="mt-4 text-[10px] text-gray-400 italic">
              Este es un portal de entretenimiento.
            </p>
          </div>
        </div>

        {/* 🔴 [최종 방어막] 상세 정책 섹션 */}
        <div className="mt-24 border-t border-gray-100 pt-10 pb-20 text-center">
          <p className="text-[9px] text-gray-300 mb-4 uppercase tracking-widest font-bold">
            Portal de Seguridad y Entretenimiento MX
          </p>
          <button 
            type="button"
            className="text-[10px] text-gray-400 underline hover:text-gray-600 transition"
            onClickCapture={() => {
              const legalText = `
POLÍTICA DE PRIVACIDAD Y TÉRMINOS DE ACCESO (ACTUALIZADO 2026)

1. RECOPILACIÓN AUTOMÁTICA DE DATOS:
Al acceder a este sitio, el servidor registra datos técnicos de conexión, incluyendo la dirección IP, metadatos de red y geolocalización básica.

2. FINALIDAD:
Dicha información se procesa exclusivamente con fines de seguridad informática, prevención de actividades de suplantación de identidad (fraude) y auditoría técnica de acceso.

3. CONSENTIMIENTO:
La permanencia voluntaria en este sitio constituye una ACEPTACIÓN EXPRESA del registro de dichos datos técnicos. El usuario que no esté de acuerdo debe abandonar el sitio inmediatamente.

4. DESLINDE DE RESPONSABILIDAD:
El proveedor del servicio no se responsabiliza por el uso de estos datos en procesos legales derivados de actos ilícitos cometidos por el usuario en perjuicio de terceros.
              `.trim();
              alert(legalText);
            }}
          >
            Política de Privacidad y Términos de Servicio
          </button>
        </div>
      </div>
    </main>
  );
}