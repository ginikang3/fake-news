import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🚀 Vercel이 페이지를 캐싱하지 않고 매번 파라미터를 읽게 강제합니다.
export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t as string;
  const i = params?.i as string;

  // 기본값 설정
  let dynamicTitle = "¡NOTICIA DE ÚLTIMA HORA!";
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png";

  if (t) {
    try {
      const decoded = Buffer.from(t, 'base64').toString('utf8');
      dynamicTitle = decodeURIComponent(decoded);
    } catch (e) { console.error("Decoding error:", e); }
  }

  if (i) {
    // 💡 수파베이스 퍼블릭 URL을 썸네일로 지정
    dynamicImage = decodeURIComponent(i);
  }

  return {
    metadataBase: new URL('https://latam-en-vivo.online'),
    title: dynamicTitle,
    description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
    openGraph: {
      title: dynamicTitle,
      description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
      images: [{
        url: dynamicImage,
        width: 1200,
        height: 630,
        alt: dynamicTitle,
      }],
      type: "website",
      siteName: "Noticiario Bromas MX",
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      images: [dynamicImage],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* 광고 스크립트 3종 보존 */}
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10804827',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
        <script src="https://5gvci.com/act/files/tag.min.js?z=10804826" data-cfasync="false" async />
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10804825',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}