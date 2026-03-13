"use client";

import { useState, useEffect } from "react";
import DOMPurify from "isomorphic-dompurify";
import { supabase } from "../../lib/supabase";
import Header from "./Header";
import Footer from "./Footer";

interface DynamicDocumentPageProps {
  slug: string;
  fallbackTitle: string;
}

export default function DynamicDocumentPage({ slug, fallbackTitle }: DynamicDocumentPageProps) {
  const [title, setTitle] = useState(fallbackTitle);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const { data } = await supabase
          .from("footer_pages")
          .select("title, content")
          .eq("slug", slug)
          .eq("published", true)
          .single();

        if (data) {
          setTitle(data.title);
          setContent(data.content);
        }
      } catch {
        // Table might not exist yet
      }
      setLoading(false);
    }
    fetchPage();
  }, [slug]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="" />
      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="h-[2px] bg-black mt-3 mb-10" />
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : content ? (
          <div
            className="text-sm leading-loose text-gray-800 document-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        ) : (
          <div className="text-sm leading-loose text-gray-800">
            <p className="text-gray-400">コンテンツが登録されていません。管理画面から編集してください。</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
