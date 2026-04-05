import type { Metadata } from "next";
import MediaListClient from "./MediaListClient";

export const metadata: Metadata = {
  title: "MEDIA",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメディア出演情報。テレビ・ラジオ・雑誌・YouTube・WEBメディアなどの出演スケジュール。",
  alternates: { canonical: "/media" },
  openGraph: {
    title: "MEDIA | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメディア出演情報。テレビ・ラジオ・雑誌・YouTube・WEBメディアなどの出演スケジュール。",
    url: "/media",
  },
};

export default function MediaPage() {
  return <MediaListClient />;
}
