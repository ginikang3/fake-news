import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// ✅ 기본 metadata만 유지 (썸네일 기본값)
export const metadata: Metadata = {
  metadataBase: new URL('https://latam-en-vivo.online'),
  title: "Bromas MX",
  description: "Generador de noticias falsas",
  openGraph: {
    title: "Bromas MX",
    description: "Generador de noticias falsas",
    images: [
      {
        url: "https://latam-en-vivo.online/thumbnail.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bromas MX",
    images: ["https://latam-en-vivo.online/thumbnail.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* ✅ 광고코드 그대로 유지 */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10804827',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }} />
        <script src="https://5gvci.com/act/files/tag.min.js?z=10804826" data-cfasync="false" async />
        <script dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10804825',s.src='https://izcle.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}