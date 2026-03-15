import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SectionHeading from "../../components/SectionHeading";
import { supabase } from "../../../lib/supabase";
import { sanitizeHtml } from "../../../lib/sanitize";

interface MediaItem {
  id: string;
  title: string;
  date: string;
  detail?: string;
  image_url?: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

const getMediaItem = cache(async (id: string): Promise<MediaItem | null> => {
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getMediaItem(id);

  if (!item) {
    return { title: "メディア情報が見つかりません" };
  }

  return {
    title: item.title,
    description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメディア出演: ${item.title}`,
    alternates: { canonical: `/media/${id}` },
    openGraph: {
      title: `${item.title} | MEDIA | THE超BOYS`,
      description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメディア出演: ${item.title}`,
      url: `/media/${id}`,
      type: "article",
      images: item.image_url
        ? [{ url: item.image_url, alt: item.title }]
        : [{ url: "/top/top_artist_photo.jpg", width: 1400, height: 1050, alt: "THE超BOYS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | MEDIA | THE超BOYS`,
      description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメディア出演: ${item.title}`,
      images: item.image_url
        ? [{ url: item.image_url, alt: item.title }]
        : [{ url: "/top/top_artist_photo.jpg", alt: "THE超BOYS" }],
    },
  };
}

export default async function MediaDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getMediaItem(id);

  if (!item) notFound();

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/media" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#ff6600">MEDIA</SectionHeading>
        <p className="section-subtitle mb-16">メディア出演情報</p>

        <article className="max-w-[800px] mx-auto">
          <span className="font-impact text-lg tracking-wide text-gray-400">
            {formatDate(item.date)}
          </span>

          <h2 className="text-2xl font-bold leading-relaxed mt-4 mb-10 pb-6 border-b border-gray-200">
            {item.title}
          </h2>

          {item.image_url && (
            <div className="mb-10">
              <Image
                src={item.image_url}
                alt={item.title}
                width={800}
                height={600}
                className="w-auto max-w-full h-auto"
                sizes="800px"
              />
            </div>
          )}

          {item.detail && (
            <div className="mb-12 rich-text-content text-sm leading-loose text-gray-700"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.detail.replace(/\n/g, "<br>")) }}
            />
          )}

          <div className="text-center pt-8 border-t border-gray-200">
            <Link
              href="/media"
              className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 transition-colors"
            >
              <span>&lsaquo;</span>
              <span>MEDIA 一覧に戻る</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
