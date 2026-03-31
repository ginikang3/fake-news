import { Suspense } from 'react';
import type { Metadata } from "next";
import ClientSideModal from './ClientSideModal';

export const dynamic = 'force-dynamic';

// ❗ Promise 제거
type Props = {
  searchParams: { [key: string]: string | undefined };
};

// ✅ 메타데이터 (봇용)
export function generateMetadata({ searchParams }: Props): Metadata {
  const t = searchParams?.t;
  const i = searchParams?.i;

  let titleText = "¡NOTICIA DE ÚLTIMA HORA!";
  if (t) {
    try {
      titleText = decodeURIComponent(Buffer.from(t, 'base64').toString('utf-8'));
    } catch (e) {}
  }

  const imageUrl = i
    ? decodeURIComponent(i)
    : "https://latam-en-vivo.online/thumbnail.png";

  return {
    title: titleText,
    openGraph: {
      title: titleText,
      description: "Haz clic para ver la noticia completa.",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      images: [imageUrl],
    },
  };
}

// ✅ 실제 페이지 (사람용)
export default function ViewPage({ searchParams }: Props) {
  const t = searchParams?.t;
  const i = searchParams?.i;

  let titleText = "¡NOTICIA DE ÚLTIMA HORA!";
  if (t) {
    try {
      titleText = decodeURIComponent(Buffer.from(t, 'base64').toString('utf-8'));
    } catch (e) {}
  }

  const imageUrl = i
    ? decodeURIComponent(i)
    : "/thumbnail.png";

  return (
    <div className="min-h-screen bg-white text-black font-sans text-left">
      <div className="bg-red-700 text-white py-3 px-4 flex items-center justify-between font-black italic shadow-lg sticky top-0 z-50">
        <span className="text-xl tracking-tighter uppercase font-black">
          NOTICIARIO <span className="bg-white text-red-700 px-1 ml-1 font-black">BROMAS MX</span>
        </span>
        <span className="animate-pulse text-sm flex items-center font-bold font-black">
          <span className="w-2 h-2 bg-white rounded-full mr-2"></span> EN VIVO
        </span>
      </div>

      <div className="p-5 max-w-2xl mx-auto mt-4 text-left font-black">
        <div className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-4 uppercase tracking-widest text-left font-black">
          EXCLUSIVA MUNDIAL
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-8 text-left font-black">
          {titleText}
        </h1>

        <div className="aspect-video w-full mb-8 shadow-2xl rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
          <img src={imageUrl} alt="Noticia" className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded font-black">
            IMÁGENES DEL MOMENTO
          </div>
        </div>

        <div className="space-y-6 text-gray-800 leading-relaxed text-lg text-left font-black">
          <p className="font-bold text-red-700 underline decoration-red-200 decoration-4 underline-offset-4 text-left font-black">
            [CIUDAD DE MÉXICO] — ÚLTIMA HORA:
          </p>
          <p className="text-left font-black">
            Fuentes oficiales han confirmado hace apenas unos minutos un suceso que ha dejado a la comunidad internacional에 충격을 주고 있습니다.
          </p>
        </div>
      </div>

      <ClientSideModal />
    </div>
  );
}