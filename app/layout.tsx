import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t;
  const i = params?.i;
  const v = params?.v;

  let dynamicTitle = "¡NOTICIA DE ÚLTIMA HORA!";
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png";
  
  // 🚀 현재 전체 URL을 구성하여 og:url에 주입 (크롤러 강제 갱신용)
  const currentUrl = `https://latam-en-vivo.online/?t=${t || ''}&i=${i || ''}&v=${v || ''}`;

  if (t) {
    try {
      const decodedTitle = Buffer.from(t, 'base64').toString('utf-8');
      dynamicTitle = decodeURIComponent(decodedTitle);
    } catch (e) { console.error(e); }
  }

  if (i) {
    dynamicImage = decodeURIComponent(i);
  }

  return {
    metadataBase: new URL('https://latam-en-vivo.online'),
    title: dynamicTitle,
    openGraph: {
      title: dynamicTitle,
      description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
      url: currentUrl, // 👈 [핵심] 크롤러에게 이 파라미터 주소가 진짜라고 알려줌
      siteName: "Noticiario Bromas MX",
      images: [{ url: dynamicImage, width: 1200, height: 630 }],
      type: "website",
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