import type { Metadata } from "next";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <h1 className="font-impact text-[8rem] sm:text-[12rem] leading-none text-gray-100 select-none">
          404
        </h1>
        <p className="text-lg font-bold text-gray-800 -mt-4">
          ページが見つかりませんでした
        </p>
        <p className="text-sm text-gray-400 mt-2">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors"
        >
          TOPに戻る
        </Link>
      </main>

      <Footer />
    </div>
  );
}
