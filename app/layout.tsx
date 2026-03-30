import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 왓츠앱/카톡 크롤러가 이 함수를 호출해서 썸네일을 만듭니다.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t as string; 
  const i = params?.i as string; 

  // 💡 기본값 (실패 시 노출)
  let dynamicTitle = "¡NOTICIA DE ÚLTIMA HORA!";
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png"; 

  if (t) {
    try {
      // Base64 디코딩 후 URL 디코딩
      dynamicTitle = decodeURIComponent(Buffer.from(t, 'base64').toString('utf8'));
    } catch (e) { console.error(e); }
  }

  if (i) {
    // 💡 이미지 주소가 파라미터로 넘어오면 절대 경로로 변환
    dynamicImage = decodeURIComponent(i);
  }

  return {
    title: dynamicTitle,
    description: "Haz clic para ver la noticia completa.",
    openGraph: {
      title: dynamicTitle,
      description: "Haz clic para ver la noticia completa.",
      images: [
        {
          url: dynamicImage,
          width: 1200,
          height: 630,
        },
      ],
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