import type { Metadata } from "next";
import DynamicDocumentPage from "../components/DynamicDocumentPage";

export const metadata: Metadata = {
  title: "イベントご参加ガイド",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のイベントご参加ガイド。フリーライブ・特典会に参加する際のルールや持ち物、当日の流れをご案内します。",
  alternates: { canonical: "/event-guide" },
};

export default function EventGuidePage() {
  return <DynamicDocumentPage slug="event-guide" fallbackTitle="イベントご参加ガイド" />;
}
