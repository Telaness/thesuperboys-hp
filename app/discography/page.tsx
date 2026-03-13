import type { Metadata } from "next";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../../lib/supabase";

export const metadata: Metadata = {
  title: "DISCOGRAPHY",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」の配信楽曲情報。デビュー曲「恋せよ乙女、愛せよ漢」が各サブスクで配信中！",
  alternates: { canonical: "/discography" },
  openGraph: {
    title: "DISCOGRAPHY | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」の配信楽曲情報。デビュー曲「恋せよ乙女、愛せよ漢」が各サブスクで配信中！",
    url: "/discography",
  },
};

interface DiscographyItem {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
}

export default async function DiscographyPage() {
  const { data } = await supabase
    .from("discography")
    .select("id, title, image_url, link_url")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const items: DiscographyItem[] = data || [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/discography" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-16 pb-32">
        <SectionHeading color="#999999">DISCOGRAPHY</SectionHeading>
        <p className="section-subtitle mb-16">配信楽曲情報</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
