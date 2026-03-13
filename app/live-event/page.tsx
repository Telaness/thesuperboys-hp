import type { Metadata } from "next";
import LiveEventListClient from "./LiveEventListClient";

export const metadata: Metadata = {
  title: "LIVE / EVENT",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のライブ・イベント情報。全国各地でのフリーライブ・オンライン特典会・生配信などの詳細やチケット情報。",
  alternates: { canonical: "/live-event" },
  openGraph: {
    title: "LIVE / EVENT | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のライブ・イベント情報。全国各地でのフリーライブ・オンライン特典会・生配信などの詳細やチケット情報。",
    url: "/live-event",
  },
};

export default function LiveEventPage() {
  return <LiveEventListClient />;
}
