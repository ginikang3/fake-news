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

  // 🚀 디버거 에러 해결: 이미지와 크기를 최우선으로, 가장 빠르게 리턴
  const imageUrl = i ? decodeURIComponent(i) : "https://latam-en-vivo.online/thumbnail.png";
  let titleText = "¡NOTICIA DE ÚLTIMA HORA!";

  if (t) {
    try {
      titleText = decodeURIComponent(Buffer.from(t, 'base64').toString('utf-8'));
    } catch (e) { /* 에러 시 기본값 유지 */ }
  }

  return {
    metadataBase: new URL('https://latam-en-vivo.online'),
    title: titleText,
    openGraph: {
      title: titleText,
      description: "Haz clic para ver la noticia completa.",
      images: [
        {
          url: imageUrl,
          width: 1200, // 👈 디버거가 요구한 필수 태그
          height: 630, // 👈 디버거가 요구한 필수 태그
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