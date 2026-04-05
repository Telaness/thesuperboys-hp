"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../../lib/supabase";

interface MediaItem {
  id: string;
  title: string;
  date: string;
  image_url: string;
}

export default function MediaListClient() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function fetchMedia() {
      const { data } = await supabase
        .from("media")
        .select("id, title, date, image_url")
        .eq("published", true)
        .order("date", { ascending: false });
      setMediaItems(data || []);
    }
    fetchMedia();
  }, []);

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/media" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-16 pb-32">
        <SectionHeading color="#ff6600">MEDIA</SectionHeading>
        <p className="section-subtitle mb-16">メディア出演情報</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaItems.map((item) => (
            <Link
              href={`/media/${item.id}`}
              key={item.id}
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">PHOTO</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <p className="text-xs text-gray-400 mb-1">{formatDate(item.date)}</p>
              <p className="text-sm font-medium group-hover:text-orange-600 transition-colors leading-relaxed">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
