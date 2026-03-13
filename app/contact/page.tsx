import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "CONTACT",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」へのお問い合わせ・お仕事のご依頼はこちら。コラボ出演・取材など何でもご連絡ください。",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "CONTACT | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」へのお問い合わせ・お仕事のご依頼はこちら。コラボ出演・取材など何でもご連絡ください。",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
