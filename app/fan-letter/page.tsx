import type { Metadata } from "next";
import DynamicDocumentPage from "../components/DynamicDocumentPage";

export const metadata: Metadata = {
  title: "ファンレター・プレゼントに関して",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」へのファンレター・プレゼントに関するご案内。送り先や受付可能な品物についてご確認ください。",
  alternates: { canonical: "/fan-letter" },
};

export default function FanLetterPage() {
  return <DynamicDocumentPage slug="fan-letter" fallbackTitle="ファンレター・プレゼントに関して" />;
}
