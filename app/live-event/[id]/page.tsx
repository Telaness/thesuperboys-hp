"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SectionHeading from "../../components/SectionHeading";
import { supabase } from "../../../lib/supabase";

interface EventItem {
  id: string;
  title: string;
  date: string;
  venue?: string;
  time?: string;
  detail?: string;
  image_url?: string;
}

const dayLabelsJa = ["日", "月", "火", "水", "木", "金", "土"];

export default function LiveEventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const { data } = await supabase
        .from("live_events")
        .select("*")
        .eq("id", id)
        .single();
      setEvent(data);
      setLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header currentPath="/live-event" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">読み込み中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header currentPath="/live-event" />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 text-lg mt-20">イベントが見つかりませんでした。</p>
          <Link href="/live-event" className="inline-block mt-8 text-red-600 underline underline-offset-4">
            LIVE / EVENT 一覧に戻る
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const date = new Date(event.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dow = dayLabelsJa[date.getDay()];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/live-event" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#e60012">LIVE / EVENT</SectionHeading>
        <p className="section-subtitle mb-16">ライブ出演情報・イベント情報</p>

        <article className="max-w-[800px] mx-auto">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-impact text-4xl tracking-wide">
              {year}.{String(month).padStart(2, "0")}.{String(day).padStart(2, "0")}
            </span>
            <span className="font-impact text-xl text-gray-400">({dow})</span>
          </div>

          <h2 className="text-2xl font-bold leading-relaxed mb-10 pb-6 border-b border-gray-200">
            {event.title}
          </h2>

          <dl className="space-y-6 mb-12">
            {event.venue && (
              <div className="flex flex-col sm:flex-row gap-2">
                <dt className="text-sm font-bold text-gray-500 shrink-0 w-[100px]">会場</dt>
                <dd className="text-sm text-gray-800">{event.venue}</dd>
              </div>
            )}
            {event.time && (
              <div className="flex flex-col sm:flex-row gap-2">
                <dt className="text-sm font-bold text-gray-500 shrink-0 w-[100px]">時間</dt>
                <dd className="text-sm text-gray-800">{event.time}</dd>
              </div>
            )}
          </dl>

          {event.image_url && (
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-10 shadow-lg">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="800px"
              />
            </div>
          )}

          {event.detail && (
            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {event.detail}
              </p>
            </div>
          )}

          <div className="text-center pt-8 border-t border-gray-200">
            <Link
              href="/live-event"
              className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <span>&lsaquo;</span>
              <span>LIVE / EVENT 一覧に戻る</span>
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
