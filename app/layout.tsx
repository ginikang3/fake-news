import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- 썸네일 제목 동적 생성 ---
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t;
  
  let dynamicTitle = "Noticiario Bromas MX"; 
  const dynamicDescription = "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia que está sacudiendo al mundo.";

  if (t && typeof t === 'string') {
    try {
      // 클라이언트 에러 방지를 위해 서버 환경에서만 Buffer 사용
      const decoded = Buffer.from(t, 'base64').toString('utf8');
      dynamicTitle = decodeURIComponent(decoded);
    } catch (e) {
      console.error("Decoding error:", e);
    }
  }

  return {
    title: dynamicTitle,
    description: dynamicDescription,
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      images: ["/thumbnail.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: dynamicTitle,
      description: dynamicDescription,
      images: ["/thumbnail.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* head 태그를 명시적으로 써주면 스크립트 에러 방지에 도움이 됩니다 */}
      <head>
        {/* Monetag 광고 스크립트 */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `(function(s){s.dataset.zone='10804827',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
          }} 
        />
        <script 
          src="https://5gvci.com/act/files/tag.min.js?z=10804826" 
          data-cfasync="false" 
          async 
        />
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `(function(s){s.dataset.zone='10804825',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
          }} 
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}