import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "PROFILE",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメンバー紹介。肥後武蔵（ムサシ）、千大翼（ツバサ）、桜樹舞都（マイト）、藤澤智也（トモヤ）、二宮康輔（コウスケ）、森田健斗（ケント）、髙橋活宏（カツヒロ）のプロフィールを公開中！",
  alternates: { canonical: "/profile" },
  openGraph: {
    title: "PROFILE | THE超BOYS 公式サイト",
    description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」のメンバー紹介。肥後武蔵（ムサシ）、千大翼（ツバサ）、桜樹舞都（マイト）、藤澤智也（トモヤ）、二宮康輔（コウスケ）、森田健斗（ケント）、髙橋活宏（カツヒロ）のプロフィールを公開中！",
    url: "/profile",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
