import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const t = params?.t as string; // 제목 파라미터
  const i = params?.i as string; // 이미지 주소 파라미터

  let dynamicTitle = "Noticiario Bromas MX";
  let dynamicImage = "https://latam-en-vivo.online/thumbnail.png"; // 기본값

  // 1. 제목 디코딩
  if (t) {
    try {
      dynamicTitle = decodeURIComponent(Buffer.from(t, 'base64').toString('utf8'));
    } catch (e) { console.error(e); }
  }

  // 2. 🚀 [핵심] 파라미터에 이미지가 있으면 썸네일 주소를 그걸로 갈아치움
  if (i) {
    dynamicImage = decodeURIComponent(i); //
  }

  return {
    title: dynamicTitle,
    openGraph: {
      title: dynamicTitle,
      description: "¡ÚLTIMO MOMENTO! Fuentes oficiales confirman la noticia.",
      images: [
        {
          url: dynamicImage, // 👈 왓츠앱이 가져가는 실제 사진
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
      </head>
      <body>{children}</body>
    </html>
  );
}