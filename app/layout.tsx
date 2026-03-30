import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t as string; // 제목 (Base64)
  const i = params?.i as string; // 💡 이미지 주소 (핵심!)

  let dynamicTitle = "Noticiario Bromas MX";
  // 사용자가 올린 이미지가 없을 때만 기본 이미지 사용
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png"; 

  if (t) {
    try {
      dynamicTitle = decodeURIComponent(Buffer.from(t, 'base64').toString('utf8'));
    } catch (e) { console.error(e); }
  }

  // 🚀 [여기 주목] 파라미터 i에 이미지 주소가 있으면 그걸 썸네일로 강제 지정!
  if (i) {
    dynamicImage = decodeURIComponent(i);
  }

  return {
    title: dynamicTitle,
    openGraph: {
      title: dynamicTitle,
      description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
      type: "website",
      images: [
        {
          url: dynamicImage, // 👈 왓츠앱이 읽어가는 실제 사진 주소
          width: 1200,
          height: 630,
        },
      ],
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
        {/* Monetag 광고 코드 유지 */}
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10804827',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}