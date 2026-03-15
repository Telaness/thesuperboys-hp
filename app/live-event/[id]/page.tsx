import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SectionHeading from "../../components/SectionHeading";
import BackToListLink from "./BackToListLink";
import { supabase } from "../../../lib/supabase";
import { sanitizeHtml } from "../../../lib/sanitize";

interface EventItem {
  id: string;
  title: string;
  date: string;
  detail?: string;
  image_url?: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

const dayLabelsJa = ["日", "月", "火", "水", "木", "金", "土"];

const getEvent = cache(async (id: string): Promise<EventItem | null> => {
  const { data } = await supabase
    .from("live_events")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "イベントが見つかりません" };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    organizer: {
      "@type": "MusicGroup",
      name: "THE超BOYS",
    },
  };

  return {
    title: event.title,
    description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のライブ・イベント: ${event.title}（${event.date}）`,
    alternates: { canonical: `/live-event/${id}` },
    openGraph: {
      title: `${event.title} | LIVE / EVENT | THE超BOYS`,
      description: `ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のライブ・イベント: ${event.title}（${event.date}）`,
      url: `/live-event/${id}`,
      type: "article",
      ...(event.image_url && {
        images: [{ url: event.image_url, alt: event.title }],
      }),
    },
    other: {
      "script:ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default async function LiveEventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const date = new Date(event.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayIndex = date.getDay();
  const dow = dayLabelsJa[dayIndex];
  const dowColor = dayIndex === 0 ? "text-red-500" : dayIndex === 6 ? "text-blue-500" : "text-gray-400";

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
            <span className={`font-impact text-xl ${dowColor}`}>({dow})</span>
          </div>

          <h2 className="text-2xl font-bold leading-relaxed mb-10 pb-6 border-b border-gray-200">
            {event.title}
          </h2>

          {event.image_url && (
            <div className="mb-10 flex justify-center">
              <Image
                src={event.image_url}
                alt={event.title}
                width={800}
                height={600}
                className="w-auto max-w-full h-auto"
                sizes="800px"
              />
            </div>
          )}

          {event.detail && (
            <div className="bg-gray-50 rounded-lg p-8 mb-12 rich-text-content text-sm leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.detail.replace(/\n/g, "<br>")) }}
            />
          )}

          <div className="text-center pt-8 border-t border-gray-200">
            <BackToListLink year={year} month={month} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
