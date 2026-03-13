import type { Metadata } from "next";
import DynamicDocumentPage from "../components/DynamicDocumentPage";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」公式サイトのプライバシーポリシー。個人情報の取り扱いについてはこちらをご確認ください。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <DynamicDocumentPage slug="privacy" fallbackTitle="プライバシーポリシー" />;
}
