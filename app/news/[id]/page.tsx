import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: post } = await supabase
    .from('news_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: "Noticiario Bromas MX",
      description: "Breaking News!",
    };
  }

  const title = `[BREAKING] ${post.title}`;
  const description = "Breaking News! Something shocking just happened!";
  const image = post.image_url;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `https://your-domain.com/news/${id}`, // ⚠️ 도메인 넣어라
      siteName: "Noticiario Bromas MX",
      images: [
        {
          url: image,
          width: 800,
          height: 600,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}