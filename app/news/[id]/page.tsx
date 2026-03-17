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

interface NewsItem {
  id: string;
  title: string;
  date: string;
  detail?: string;
  image_url?: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

const getNewsItem = cache(async (id: string): Promise<NewsItem | null> => {
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getNewsItem(id);

  if (!item) {
    return { title: "ニュースが見つかりません" };
  }

  return {
    title: item.title,
    description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のニュース: ${item.title}`,
    alternates: { canonical: `/news/${id}` },
    openGraph: {
      title: `${item.title} | NEWS | THE超BOYS`,
      description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のニュース: ${item.title}`,
      url: `/news/${id}`,
      type: "article",
      images: item.image_url
        ? [{ url: item.image_url, alt: item.title }]
        : [{ url: "/link_pic.jpg", width: 1200, height: 630, alt: "THE超BOYS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | NEWS | THE超BOYS`,
      description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のニュース: ${item.title}`,
      images: item.image_url
        ? [{ url: item.image_url, alt: item.title }]
        : [{ url: "/link_pic.jpg", alt: "THE超BOYS" }],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getNewsItem(id);

  if (!item) notFound();

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/news" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#0068b7">NEWS</SectionHeading>
        <p className="section-subtitle mb-16">最新ニュース</p>

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
              href="/news"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>&lsaquo;</span>
              <span>NEWS 一覧に戻る</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
