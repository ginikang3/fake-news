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
  title: "Noticiario Bromas MX", // 제목만 살짝 수정
  description: "Trolea a tus amigos con noticias falsas",
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