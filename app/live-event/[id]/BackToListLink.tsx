"use client";

import { useRouter } from "next/navigation";

export default function BackToListLink() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
    >
      <span>&lsaquo;</span>
      <span>LIVE / EVENT 一覧に戻る</span>
    </button>
  );
}
