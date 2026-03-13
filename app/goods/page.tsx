import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";

export const metadata: Metadata = {
  title: "GOODS",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のグッズ情報。オリジナルのブロマイド、Tシャツなどの商品をオンラインストアで販売中！",
  alternates: { canonical: "/goods" },
  openGraph: {
    title: "GOODS | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のグッズ情報。オリジナルのブロマイド、Tシャツなどの商品をオンラインストアで販売中！",
    url: "/goods",
  },
};

export default function GoodsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/goods" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#e91e8c">GOODS</SectionHeading>
        <p className="section-subtitle mb-16">グッズ情報</p>

        <p className="text-sm text-gray-900">公開までしばらくお待ちください。</p>
      </main>

      <Footer />
    </div>
  );
}
