import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // 폰트 복구
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// --- 🎣 동적 메타데이터 로직 (여기만 추가됨) ---
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t as string; 
  const i = params?.i as string; 

  let dynamicTitle = "Noticiario Bromas MX";
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png"; 

  if (t) {
    try {
      dynamicTitle = decodeURIComponent(Buffer.from(t, 'base64').toString('utf8'));
    } catch (e) { console.error(e); }
  }

  if (i) {
    dynamicImage = decodeURIComponent(i);
  }

  return {
    title: dynamicTitle,
    openGraph: {
      title: dynamicTitle,
      description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
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

// --- 뼈대 디자인 복구 ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* 기존 광고 스크립트 3종 세트 복구 */}
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