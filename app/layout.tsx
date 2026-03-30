import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t;
  const i = params?.i;

  let dynamicTitle = "¡NOTICIA DE ÚLTIMA HORA!";
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png";

  if (t) {
    try {
      // 서버측에서 안전하게 Base64 디코딩
      const decodedTitle = Buffer.from(t, 'base64').toString('utf-8');
      dynamicTitle = decodeURIComponent(decodedTitle);
    } catch (e) {
      console.error("Title decoding failed", e);
    }
  }

  if (i) {
    // 💡 이미지 URL은 인코딩된 상태 그대로 오므로 한 번만 디코딩
    dynamicImage = decodeURIComponent(i);
  }

  return {
    title: dynamicTitle,
    description: "Haz clic para ver la noticia completa.",
    openGraph: {
      title: dynamicTitle,
      description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
      images: [
        {
          url: dynamicImage,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
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