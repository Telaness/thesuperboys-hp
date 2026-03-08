"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SectionHeading from "../../components/SectionHeading";
import { supabase } from "../../../lib/supabase";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  detail?: string;
  image_url?: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
      setItem(data);
      setLoading(false);
    }
    fetchNews();
  }, [id]);

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header currentPath="/news" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">読み込み中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header currentPath="/news" />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 text-lg mt-20">ニュースが見つかりませんでした。</p>
          <Link href="/news" className="inline-block mt-8 text-blue-600 underline underline-offset-4">
            NEWS 一覧に戻る
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-10 shadow-lg">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover"
                sizes="800px"
              />
            </div>
          )}

          {item.detail && (
            <div className="mb-12">
              <p className="text-sm leading-loose text-gray-700 whitespace-pre-wrap">
                {item.detail}
              </p>
            </div>
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
