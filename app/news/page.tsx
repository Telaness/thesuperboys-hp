"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../../lib/supabase";

interface NewsItem {
  id: string;
  title: string;
  date: string;
}

const PER_PAGE = 10;

export default function NewsPage() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from("news")
        .select("id, title, date")
        .order("date", { ascending: false });
      setAllNews(data || []);
    }
    fetchNews();
  }, []);

  const totalPages = Math.max(1, Math.ceil(allNews.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const pageItems = allNews.slice(start, start + PER_PAGE);

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/news" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#0068b7">NEWS</SectionHeading>
        <p className="section-subtitle mb-16">最新ニュース</p>

        <div className="space-y-0">
          {pageItems.map((item) => (
            <Link
              href={`/news/${item.id}`}
              key={item.id}
              className="flex items-center gap-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <span className="font-impact text-lg tracking-wide text-gray-400 shrink-0 w-[130px]">
                {formatDate(item.date)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0">
                &rsaquo;
              </span>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="font-impact text-lg px-3 py-1 hover:opacity-60 transition-opacity disabled:opacity-20"
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`font-impact text-lg w-10 h-10 rounded transition-colors ${
                  p === page
                    ? "bg-black text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="font-impact text-lg px-3 py-1 hover:opacity-60 transition-opacity disabled:opacity-20"
            >
              &rsaquo;
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
