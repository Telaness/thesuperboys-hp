"use client";

import Link from "next/link";

interface BackToListLinkProps {
  year: number;
  month: number;
}

export default function BackToListLink({ year, month }: BackToListLinkProps) {
  return (
    <Link
      href={`/live-event?y=${year}&m=${month}`}
      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors"
    >
      <span>&lsaquo;</span>
      <span>LIVE / EVENT 一覧に戻る</span>
    </Link>
  );
}
