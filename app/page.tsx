import ClientPage from './ClientPage';
import type { Metadata } from "next";

type Props = {
  searchParams: { t?: string; i?: string };
};

const DEFAULT_TITLE = "¡NOTICIA DE ÚLTIMA HORA!";
const DEFAULT_IMAGE = "https://latam-en-vivo.online/thumbnail.png";

function decodeTitle(t?: string) {
  if (!t) return DEFAULT_TITLE;

  try {
    return decodeURIComponent(
      Buffer.from(t, 'base64').toString('utf-8')
    );
  } catch {
    return DEFAULT_TITLE;
  }
}

function decodeImage(i?: string) {
  if (!i) return DEFAULT_IMAGE;
  try {
    return decodeURIComponent(i);
  } catch {
    return DEFAULT_IMAGE;
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const titleText = decodeTitle(searchParams?.t);
  const imageUrl = decodeImage(searchParams?.i);

  return {
    title: titleText,
    description: "Noticias de última hora en tiempo real",
    openGraph: {
      title: titleText,
      description: "Haz clic para ver la noticia completa.",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: "Noticias de última hora en tiempo real",
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <ClientPage />
    </div>
  );
}