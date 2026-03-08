"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SectionHeading from "./components/SectionHeading";
import { supabase } from "../lib/supabase";

interface LiveEvent {
  id: string;
  title: string;
  date: string;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
}

interface MediaItem {
  id: string;
  title: string;
  date: string;
}

export default function Home() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [eventsRes, newsRes, mediaRes] = await Promise.all([
        // 本日以降で最も近いイベント3件
        supabase.from("live_events").select("id, title, date").gte("date", today).order("date", { ascending: true }).limit(3),
        // 本日以前で最も近いニュース3件
        supabase.from("news").select("id, title, date").lte("date", today).order("date", { ascending: false }).limit(3),
        supabase.from("media").select("id, title, date").order("date", { ascending: false }).limit(2),
      ]);
      if (eventsRes.data) setLiveEvents(eventsRes.data);
      if (newsRes.data) setNewsItems(newsRes.data);
      if (mediaRes.data) setMediaItems(mediaRes.data);
    }
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/" />

      <div className="flex-1 w-full">
      {/* Hero */}
      <section className="w-full">
        <div className="relative w-full aspect-[16/9] max-h-[80vh] bg-black overflow-hidden">
          <Image src="/top_artist_photo.jpg" alt="THE超BOYS メインビジュアル" fill className="object-contain" priority />
        </div>
      </section>

      {/* LIVE/EVENT & NEWS */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div id="live-event">
            <SectionHeading color="#e60012">LIVE / EVENT</SectionHeading>
            <p className="section-subtitle">ライブ出演情報・イベント情報</p>
            <div className="mt-10 space-y-6">
              {liveEvents.map((event) => (
                <Link key={event.id} href={`/live-event/${event.id}`} className="block cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="list-item-date">{formatDate(event.date)}</p>
                  <p className="list-item-title">{event.title}</p>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/live-event" className="view-all">VIEW ALL</Link>
            </div>
          </div>

          <div id="news">
            <SectionHeading color="#0068b7">NEWS</SectionHeading>
            <p className="section-subtitle">最新ニュース</p>
            <div className="mt-10 space-y-6">
              {newsItems.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="block cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="list-item-date">{formatDate(item.date)}</p>
                  <p className="list-item-title">{item.title}</p>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/news" className="view-all">VIEW ALL</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOVIE */}
      <section id="movie" className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionHeading color="#f5c500">MOVIE</SectionHeading>
        <p className="section-subtitle">ミュージックビデオ情報</p>
        <div className="mt-10">
          <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/Hg1r-S5ooQc?si=CINgIX2szVPPWKpy"
              title="THE超BOYS「恋せよ乙女、愛せよ漢」Music Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
        <div className="mt-8 text-right">
          <Link href="/movie" className="view-all">VIEW ALL</Link>
        </div>
      </section>

      {/* PROFILE */}
      <section id="profile" className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionHeading color="#00a74a">PROFILE</SectionHeading>
        <p className="section-subtitle">プロフィール情報</p>
        <div className="mt-10">
          <Link href="/profile" className="profile-overlay block">
            <div className="relative w-full aspect-[2/1] bg-gray-900 rounded overflow-hidden">
              <Image src="/clickhere.jpg" alt="THE超BOYS プロフィール" fill className="object-cover object-top" />
              <span className="profile-overlay-text">CLICK HERE</span>
            </div>
          </Link>
        </div>
      </section>

      {/* DISCOGRAPHY */}
      <section id="discography" className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionHeading color="#999999">DISCOGRAPHY</SectionHeading>
        <p className="section-subtitle">配信楽曲情報</p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <div className="relative aspect-square bg-black rounded overflow-hidden">
              <Image src="/single_jacket.jpg" alt="恋せよ乙女、愛せよ漢" fill className="object-cover" />
            </div>
          </div>
          <div className="flex items-center justify-center aspect-square bg-black rounded">
            <span className="coming-soon-text text-white">
              COMING<br />SOON
            </span>
          </div>
          <div className="flex items-center justify-center aspect-square bg-black rounded">
            <span className="coming-soon-text text-white">
              COMING<br />SOON
            </span>
          </div>
        </div>
        <div className="mt-8 text-right">
          <Link href="/discography" className="view-all">VIEW ALL</Link>
        </div>
      </section>

      {/* MEDIA & GOODS */}
      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div id="media">
            <SectionHeading color="#ff6600">MEDIA</SectionHeading>
            <p className="section-subtitle">メディア出演情報</p>
            <div className="mt-10 space-y-6">
              {mediaItems.map((item) => (
                <div key={item.id} className="cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="list-item-date">{formatDate(item.date)}</p>
                  <p className="list-item-title">{item.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/media" className="view-all">VIEW ALL</Link>
            </div>
          </div>

          <div id="goods">
            <SectionHeading color="#e91e8c">GOODS</SectionHeading>
            <p className="section-subtitle">グッズ情報</p>
            <div className="mt-10">
              <p className="text-sm text-gray-600">公開までしばらくお待ちください。</p>
            </div>
            <div className="mt-12 text-center">
              <Link href="/goods" className="view-all">VIEW ALL</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-[1200px] mx-auto px-6 py-20">
        <SectionHeading color="#222222">CONTACT</SectionHeading>
        <p className="section-subtitle">お問い合わせ</p>
        <div className="mt-10 space-y-4">
          <p className="text-sm leading-relaxed">
            THE超BOYSへのお問い合わせ・お仕事のご依頼は
            <Link href="/contact" className="text-orange-600 underline underline-offset-4">
              こちらから
            </Link>
            お願いします。
          </p>
          <p className="text-sm leading-relaxed text-gray-600">
            お問い合わせいただいた内容によって返信できない場合がございますのでご了承ください。
          </p>
        </div>
      </section>

      </div>

      <Footer />
    </div>
  );
}
