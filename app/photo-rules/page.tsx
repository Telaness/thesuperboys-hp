import type { Metadata } from "next";
import DynamicDocumentPage from "../components/DynamicDocumentPage";

export const metadata: Metadata = {
  title: "撮影会ルールノート",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」の撮影会ルールノート。撮影会での禁止事項・マナー・注意点をまとめています。",
  alternates: { canonical: "/photo-rules" },
};

export default function PhotoRulesPage() {
  return <DynamicDocumentPage slug="photo-rules" fallbackTitle="撮影会ルールノート" />;
}
