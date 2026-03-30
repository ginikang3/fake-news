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

  // 💡 크롤러가 헷갈리지 않게 URL에서 직접 이미지를 추출합니다.
  const imageUrl = i ? decodeURIComponent(i) : "https://latam-en-vivo.online/thumbnail.png";
  let titleText = "¡NOTICIA DE ÚLTIMA HORA!";

  if (t) {
    try {
      titleText = decodeURIComponent(Buffer.from(t, 'base64').toString('utf-8'));
    } catch (e) { console.error(e); }
  }

  return {
    metadataBase: new URL('https://latam-en-vivo.online'),
    title: titleText,
    openGraph: {
      title: titleText,
      description: "Haz clic para ver la noticia completa.",
      images: [
        {
          url: imageUrl, // 👈 수파베이스 다이렉트 링크
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
      url: "./", // 현재 경로 유지
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* 광고 스크립트 3종 (절대 보존) */}
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