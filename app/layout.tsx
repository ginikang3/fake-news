// app/layout.tsx
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

// --- 썸네일 제목 동적 생성 (Next.js 15 표준 방식) ---
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams; // 👈 여기서 await를 안 해주면 빌드 에러가 납니다.
  const t = params.t;
  let dynamicTitle = "Noticiario Bromas MX"; 

  try {
    if (t && typeof t === 'string') {
      // Base64 디코딩
      dynamicTitle = decodeURIComponent(Buffer.from(t, 'base64').toString('utf8'));
    }
  } catch (e) {
    console.error("Error decoding title", e);
  }

  const dynamicDescription = "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia que está sacudiendo al mundo.";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* --- Monetag 광고 스크립트 그대로 유지 --- */}
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10804827',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
        <script src="https://5gvci.com/act/files/tag.min.js?z=10804826" data-cfasync="false" async />
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10804825',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      </body>
    </html>
  );
}