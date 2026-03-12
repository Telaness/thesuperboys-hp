"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

interface DiscographyItem {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
}

export default function Home() {
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [discoItems, setDiscoItems] = useState<DiscographyItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split("T")[0];

      const [eventsRes, newsRes, mediaRes, discoRes] = await Promise.all([
        supabase.from("live_events").select("id, title, date").gte("date", today).order("date", { ascending: true }).limit(3),
        supabase.from("news").select("id, title, date").lte("date", today).order("date", { ascending: false }).limit(3),
        supabase.from("media").select("id, title, date").order("date", { ascending: false }).limit(2),
        supabase.from("discography").select("id, title, image_url, link_url").eq("published", true).order("created_at", { ascending: false }).limit(3),
      ]);
      if (eventsRes.data) setLiveEvents(eventsRes.data);
      if (newsRes.data) setNewsItems(newsRes.data);
      if (mediaRes.data) setMediaItems(mediaRes.data);
      if (discoRes.data) setDiscoItems(discoRes.data);
    }
    fetchData();
  }, []);

  const heroSlideData = [
    { src: "/top/top_artist_photo.jpg", href: "" },
    { src: "/top/line.jpg", href: "https://line.me/R/ti/p/@147dvbcj?oat__id=6310431" },
    { src: "/top/muchU.jpg", href: "https://muchulive.com/" },
  ];
  const heroCount = heroSlideData.length;
  // Clone first slide at end for seamless loop
  const heroSlides = [...heroSlideData, heroSlideData[0]];
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroTransition, setHeroTransition] = useState(true);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const resetHeroTimer = useCallback(() => {
    if (heroTimer.current) clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => {
      setHeroIndex((prev) => prev + 1);
    }, 6000);
  }, []);

  useEffect(() => {
    resetHeroTimer();
    return () => {
      if (heroTimer.current) clearInterval(heroTimer.current);
    };
  }, [resetHeroTimer]);

  // When reaching the clone slide, snap back to real first slide
  useEffect(() => {
    if (heroIndex !== heroCount) {
      setHeroTransition(true);
      return;
    }

    const slider = sliderRef.current;
    let snapped = false;

    const snap = () => {
      if (snapped) return;
      snapped = true;
      setHeroTransition(false);
      setHeroIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeroTransition(true);
        });
      });
    };

    const handleTransitionEnd = () => snap();
    slider?.addEventListener("transitionend", handleTransitionEnd, { once: true });
    // Fallback in case transitionend doesn't fire
    const fallback = setTimeout(snap, 1600);

    return () => {
      slider?.removeEventListener("transitionend", handleTransitionEnd);
      clearTimeout(fallback);
    };
  }, [heroIndex, heroCount]);

  const formatDate = (dateStr: string) => dateStr.replace(/-/g, "/");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/" />

      <div className="flex-1 w-full">
      {/* Hero Slider */}
      <section className="w-full max-w-[1400px] mx-auto">
        <div className="relative w-full overflow-hidden">
          <div
            ref={sliderRef}
            className={`flex ${heroTransition ? "transition-transform duration-[1400ms] ease-in-out" : ""}`}
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
          >
            {heroSlides.map((slide, i) => {
              const inner = (
                <Image
                  src={slide.src}
                  alt={`THE超BOYS メインビジュアル ${(i % heroCount) + 1}`}
                  width={1400}
                  height={1050}
                  className="w-full h-auto"
                  priority={i === 0}
                />
              );
              return (
                <div key={`slide-${i}`} className="w-full flex-shrink-0">
                  {slide.href ? (
                    <a href={slide.href} target="_blank" rel="noopener noreferrer" className="block">
                      {inner}
                    </a>
                  ) : inner}
                </div>
              );
            })}
          </div>
          {/* Left arrow */}
          <button
            onClick={() => {
              setHeroTransition(true);
              setHeroIndex((prev) => (prev - 1 + heroCount) % heroCount);
              resetHeroTimer();
            }}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="前のスライド"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {/* Right arrow */}
          <button
            onClick={() => {
              setHeroTransition(true);
              setHeroIndex((prev) => prev + 1);
              resetHeroTimer();
            }}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="次のスライド"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlideData.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setHeroTransition(true);
                  setHeroIndex(i);
                  resetHeroTimer();
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === heroIndex % heroCount ? "bg-white scale-110" : "bg-white/40"
                }`}
                aria-label={`スライド ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* LIVE/EVENT & NEWS */}
      <section className="max-w-[1050px] mx-auto px-6 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div id="live-event" className="flex flex-col">
            <SectionHeading color="#e60012">LIVE / EVENT</SectionHeading>
            <p className="section-subtitle">ライブ出演情報・イベント情報</p>
            <div className="mt-6 md:mt-10 space-y-6 md:min-h-[150px] md:flex-1">
              {liveEvents.map((event) => (
                <Link key={event.id} href={`/live-event/${event.id}`} className="block cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="list-item-date">{formatDate(event.date)}</p>
                  <p className="list-item-title">{event.title}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 md:mt-12 text-right">
              <Link href="/live-event" className="view-all">VIEW ALL</Link>
            </div>
          </div>

          <div id="news" className="flex flex-col">
            <SectionHeading color="#0068b7">NEWS</SectionHeading>
            <p className="section-subtitle">最新ニュース</p>
            <div className="mt-6 md:mt-10 space-y-6 md:min-h-[150px] md:flex-1">
              {newsItems.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="block cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="list-item-date">{formatDate(item.date)}</p>
                  <p className="list-item-title">{item.title}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 md:mt-12 text-right">
              <Link href="/news" className="view-all">VIEW ALL</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOVIE */}
      <section id="movie" className="max-w-[1050px] mx-auto px-6 py-10 md:py-20">
        <SectionHeading color="#f5c500">MOVIE</SectionHeading>
        <p className="section-subtitle">ミュージックビデオ情報</p>
        <div className="mt-6 md:mt-10">
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
      <section id="profile" className="max-w-[1050px] mx-auto px-6 py-10 md:py-20">
        <SectionHeading color="#00a74a">PROFILE</SectionHeading>
        <p className="section-subtitle">プロフィール情報</p>
        <div className="mt-6 md:mt-10">
          <Link href="/profile" className="profile-overlay block">
            <div className="relative w-full aspect-[2/1] bg-gray-900 rounded overflow-hidden">
              <Image src="/clickhere.jpg" alt="THE超BOYS プロフィール" fill className="object-cover object-top" />
              {/* Image already contains CLICK HERE text */}
            </div>
          </Link>
        </div>
      </section>

      {/* DISCOGRAPHY */}
      <section id="discography" className="max-w-[1050px] mx-auto px-6 py-10 md:py-20">
        <SectionHeading color="#999999">DISCOGRAPHY</SectionHeading>
        <p className="section-subtitle">配信楽曲情報</p>
        <div className="mt-6 md:mt-10 min-h-[200px] sm:min-h-[250px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {discoItems.map((item) => (
              <a
                key={item.id}
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:opacity-80 transition-opacity"
              >
                <div className="relative aspect-square bg-black rounded overflow-hidden">
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 text-right">
          <Link href="/discography" className="view-all">VIEW ALL</Link>
        </div>
      </section>

      {/* MEDIA & GOODS */}
      <section className="max-w-[1050px] mx-auto px-6 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div id="media" className="flex flex-col">
            <SectionHeading color="#ff6600">MEDIA</SectionHeading>
            <p className="section-subtitle">メディア出演情報</p>
            <div className="mt-6 md:mt-10 space-y-6 md:min-h-[150px] md:flex-1">
              {mediaItems.map((item) => (
                <div key={item.id} className="cursor-pointer hover:opacity-70 transition-opacity">
                  <p className="list-item-date">{formatDate(item.date)}</p>
                  <p className="list-item-title">{item.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 md:mt-12 text-right">
              <Link href="/media" className="view-all">VIEW ALL</Link>
            </div>
          </div>

          <div id="goods" className="flex flex-col">
            <SectionHeading color="#e91e8c">GOODS</SectionHeading>
            <p className="section-subtitle">グッズ情報</p>
            <div className="mt-6 md:mt-10 md:min-h-[150px] md:flex-1">
              <p className="text-sm text-gray-900">公開までしばらくお待ちください。</p>
            </div>
            <div className="mt-8 md:mt-12 text-right">
              <Link href="/goods" className="view-all">VIEW ALL</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-[1050px] mx-auto px-6 pt-10 pb-28 md:pt-20 md:pb-56">
        <SectionHeading color="#222222">CONTACT</SectionHeading>
        <p className="section-subtitle">お問い合わせ</p>
        <div className="mt-6 md:mt-10 space-y-4">
          <p className="text-sm leading-relaxed">
            THE超BOYSへのお問い合わせ・お仕事のご依頼は
            <Link href="/contact" className="text-orange-600 underline underline-offset-4">
              こちらから
            </Link>
            お願いします。
          </p>
          <p className="text-sm leading-relaxed text-gray-900">
            ※お問い合わせいただいた内容によって返信できない場合がございますのでご了承ください。
          </p>
        </div>
      </section>

      </div>

      <Footer />
    </div>
  );
}
