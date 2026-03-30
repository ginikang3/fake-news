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

// 레이아웃에서는 고정 메타데이터만 사용 (빌드 에러 방지)
export const metadata: Metadata = {
  title: "Noticiario Bromas MX",
  description: "Trolea a tus amigos con noticias falsas",
  openGraph: {
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* --- Monetag Ad Scripts Start --- */}
        
        {/* 1. MultiTag (Zone: 10804827) */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `(function(s){s.dataset.zone='10804827',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
          }} 
        />

        {/* 2. Interstitial/Popunder (Zone: 10804826) */}
        <script 
          src="https://5gvci.com/act/files/tag.min.js?z=10804826" 
          data-cfasync="false" 
          async 
        />

        {/* 3. Vignette (Zone: 10804825) */}
        <script 
          dangerouslySetInnerHTML={{ 
            __html: `(function(s){s.dataset.zone='10804825',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
          }} 
        />

        {/* --- Monetag Ad Scripts End --- */}
      </body>
    </html>
  );
}