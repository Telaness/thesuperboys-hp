import type { Metadata } from "next";
import DynamicDocumentPage from "../components/DynamicDocumentPage";

export const metadata: Metadata = {
  title: "著作権に関して",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」公式サイトの著作権に関する情報。コンテンツの利用規約についてはこちらをご確認ください。",
  alternates: { canonical: "/copyright" },
};

export default function CopyrightPage() {
  return <DynamicDocumentPage slug="copyright" fallbackTitle="著作権に関して" />;
}
