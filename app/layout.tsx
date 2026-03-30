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

export const metadata: Metadata = {
  title: "Noticiario Bromas MX",
  description: "Trolea a tus amigos con noticias falsas",
  // --- 여기에서 이미지만 연결 (Open Graph 및 Twitter Card) ---
  openGraph: {
    images: [
      {
        url: "/thumbnail.png", // public 폴더의 영문 파일명과 일치해야 함
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
  // ---------------------------------------------------------
};

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