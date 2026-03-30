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
  const t = params?.t; // 제목 (Base64)
  const i = params?.i; // 이미지 URL 👈 이게 추가되어야 사진이 바뀝니다!

  let dynamicTitle = "Noticiario Bromas MX"; 
  const dynamicDescription = "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.";
  
  // 💡 사용자가 올린 사진이 없으면 보여줄 기본 이미지
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png"; 

  if (t && typeof t === 'string') {
    try {
      const decoded = Buffer.from(t, 'base64').toString('utf8');
      dynamicTitle = decodeURIComponent(decoded);
    } catch (e) { console.error(e); }
  }

  // 💡 핵심: i 파라미터에 이미지가 있으면 썸네일을 그걸로 교체!
  if (i && typeof i === 'string') {
    dynamicImage = decodeURIComponent(i);
  }

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      type: "website",
      images: [
        {
          url: dynamicImage, // 👈 여기가 님이 올린 사진 주소로 들어감
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