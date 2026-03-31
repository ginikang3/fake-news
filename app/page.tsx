import ClientPage from './ClientPage';
import type { Metadata } from "next";

type Props = {
  searchParams: { t?: string; i?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const t = searchParams?.t;
  const i = searchParams?.i;

  const imageUrl = i
    ? decodeURIComponent(i)
    : "https://latam-en-vivo.online/thumbnail.png";

  let titleText = "¡NOTICIA DE ÚLTIMA HORA!";

  if (t) {
    try {
      titleText = decodeURIComponent(
        Buffer.from(t, 'base64').toString('utf-8')
      );
    } catch {}
  }

  return {
    title: titleText,
    openGraph: {
      title: titleText,
      description: "Haz clic para ver la noticia completa.",
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <ClientPage />;
}