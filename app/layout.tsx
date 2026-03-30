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

// --- 메타데이터 동적 생성 부분 ---
export async function generateMetadata({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  // URL에서 t 파라미터를 읽어옵니다. 없으면 기본 제목을 사용합니다.
  const dynamicTitle = typeof searchParams.t === 'string' ? searchParams.t : "Noticiario Bromas MX";

  return {
    title: dynamicTitle, // 이제 카톡/와츠앱 제목에 사용자가 쓴 글이 뜹니다.
    description: "Trolea a tus amigos con noticias falsas",
    openGraph: {
      title: dynamicTitle,
      images: [
        {
          url: "/thumbnail.png",
          width: 1200,
          height: 630,
          alt: "Breaking News Thumbnail",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/thumbnail.png"],
    },
  };
}
// ------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* 여기에 Monetag 전면 광고(Interstitial) 스크립트만 슥 넣으시면 됩니다 */}
        {/* <script src="..."></script> */}
      </body>
    </html>
  );
}