import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thesuperboys.jp"),
  title: {
    default: "THE超BOYS | 公式サイト",
    template: "%s | THE超BOYS 公式サイト",
  },
  description:
    "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」公式ホームページ。最新のライブ・イベント情報、メンバープロフィール、楽曲情報など。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "THE超BOYS 公式サイト",
    title: "THE超BOYS | 公式サイト",
    description:
      "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」公式ホームページ。最新のライブ・イベント情報、メンバープロフィール、楽曲情報など。",
    url: "/",
    images: [
      {
        url: "/top/top_artist_photo.jpg",
        width: 1400,
        height: 1050,
        alt: "THE超BOYS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@THESUPERBOYS123",
    title: "THE超BOYS | 公式サイト",
    description:
      "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」公式ホームページ。最新のライブ・イベント情報、メンバープロフィール、楽曲情報など。",
    images: ["/top/top_artist_photo.jpg"],
  },
  icons: {
    icon: "/thesuperboys_fav.png",
    apple: "/thesuperboys_fav.png",
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "THE超BOYS",
  url: "https://thesuperboys.jp",
  image: "https://thesuperboys.jp/top/top_artist_photo.jpg",
  description: "ヒーローアイドル「THE超BOYS（ザ・スーパーボーイズ）」",
  genre: "J-POP",
  sameAs: [
    "https://www.instagram.com/THESUPERBOYS_123",
    "https://x.com/THESUPERBOYS123",
    "https://www.tiktok.com/@thesuperboys_123",
    "https://www.youtube.com/@THESUPERBOYS123",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${notoSansJP.variable} ${notoSansJP.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
