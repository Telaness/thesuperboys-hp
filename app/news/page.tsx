import type { Metadata } from "next";
import NewsListClient from "./NewsListClient";

export const metadata: Metadata = {
  title: "NEWS",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」の最新ニュース。楽曲リリース、メディア出演など、グループに関する重要なお知らせはこちら。",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "NEWS | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」の最新ニュース。楽曲リリース、メディア出演など、グループに関する重要なお知らせはこちら。",
    url: "/news",
  },
};

export default function NewsPage() {
  return <NewsListClient />;
}
