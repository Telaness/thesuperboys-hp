"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";

interface Member {
  name: string;
  realName: string;
  catchphrase: string;
  superCall: string;
  color: string;
  birthday: string;
  image: string;
  sns: {
    instagram: string;
    tiktok: string;
    x: string;
  };
}

const members: Member[] = [
  {
    name: "MUSASHI",
    realName: "肥後武蔵",
    catchphrase: "熱く燃やせ！超パワー！！",
    superCall: "SUPER RED ムサシ！！！",
    color: "#e60012",
    birthday: "06/28",
    image: "/profile/MUSASHI.jpg",
    sns: {
      instagram: "https://www.instagram.com/mu_mu_mu07?igsh=MWNrcDY4eW1yanFuaw%3D%3D&utm_source=qr",
      tiktok: "https://www.tiktok.com/@musashi567?_r=1&_t=ZS-935uEkJINkr",
      x: "https://x.com/mumumu_mumumu07?s=21&t=h8EEletchkN7xlze1DcouQ",
    },
  },
  {
    name: "TSUBASA",
    realName: "千大翼",
    catchphrase: "豪快に吹き荒れろ！超エンジン！！",
    superCall: "SUPER SKYBLUE ツバサ！！！",
    color: "#00b7ee",
    birthday: "04/06",
    image: "/profile/TSUBASA.jpg",
    sns: {
      instagram: "https://www.instagram.com/tsubasa_chidai?igsh=ZmFvMnB3dmhzd3Fk&utm_source=qr",
      tiktok: "https://www.tiktok.com/@tsubasa.chidai?_r=1&_t=ZS-931zaPJqDzg",
      x: "https://x.com/st19910406?s=21&t=R3zgHmU-L9zkIF6aF4j3hQ",
    },
  },
  {
    name: "MAITO",
    realName: "桜樹舞都",
    catchphrase: "輝く稲妻、惚れんなよ？超スパークキラー！！",
    superCall: "SUPER YELLOW マイト！！！",
    color: "#f5c500",
    birthday: "04/26",
    image: "/profile/MAITO.jpg",
    sns: {
      instagram: "https://www.instagram.com/sakuragi_maito?igsh=MWppMm4zZnl1OTByMg%3D%3D&utm_source=qr",
      tiktok: "https://www.tiktok.com/@maito_sakuragi?_r=1&_t=ZS-932FUAlOIaa",
      x: "https://x.com/maito_sakuragi?s=21&t=XP334Jll6Ks1DGtQkBla_Q",
    },
  },
  {
    name: "TOMOYA",
    realName: "藤澤智也",
    catchphrase: "大地よ轟け！超ダンシング！！",
    superCall: "SUPER GREEN トモヤ！！！",
    color: "#00a74a",
    birthday: "04/15",
    image: "/profile/TOMOYA.jpg",
    sns: {
      instagram: "https://www.instagram.com/_tomoya0415?igsh=d3Q1NHUzODViMGQ4&utm_source=qr",
      tiktok: "https://www.tiktok.com/@0415_tomoya?_r=1&_t=ZS-931tRQu7xBZ",
      x: "https://x.com/_tomoyadesu?s=21&t=irK1cI6I8wPhaKlatzMb_g",
    },
  },
  {
    name: "KOUSUKE",
    realName: "二宮康輔",
    catchphrase: "ハッピーあげるよ！超キュート！！",
    superCall: "SUPER WHITE コウスケ！！！",
    color: "#999999",
    birthday: "04/24",
    image: "/profile/KOUSUKE.jpg",
    sns: {
      instagram: "https://www.instagram.com/ninosuke0424?igsh=a2xhc3A0ZzRvcjE5&utm_source=qr",
      tiktok: "https://www.tiktok.com/@kosuke04240?_r=1&_t=ZS-931vq0jDAbE",
      x: "https://x.com/ninosuke0424?s=21&t=OoIK35kjpWawF1RTENuhyg",
    },
  },
  {
    name: "KENTO",
    realName: "森田健斗",
    catchphrase: "君を照らす太陽に！超マイペース！！",
    superCall: "SUPER ORANGE ケント！！！",
    color: "#ff6600",
    birthday: "06/25",
    image: "/profile/KENTO.jpg",
    sns: {
      instagram: "https://www.instagram.com/mozuku_taro_/",
      tiktok: "https://www.tiktok.com/@mozuku_taro_",
      x: "https://x.com/mozuku_taro_",
    },
  },
  {
    name: "KATSUHIRO",
    realName: "髙橋活宏",
    catchphrase: "その心すべて受け止める！超スマート！！",
    superCall: "SUPER LIGHTPINK カツヒロ！！！",
    color: "#e91e8c",
    birthday: "01/10",
    image: "/profile/KATSUHIRO.jpg",
    sns: {
      instagram: "https://www.instagram.com/katsu__0110/",
      tiktok: "https://www.tiktok.com/@katsu__0110",
      x: "https://x.com/katsu__0110",
    },
  },
];

export default function ProfilePage() {
  const [selectedMember, setSelectedMember] = useState<(typeof members)[0] | null>(null);

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMember]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/profile" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#00a74a">PROFILE</SectionHeading>
        <p className="section-subtitle mb-16">プロフィール情報</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {members.map((member) => (
            <div
              key={member.name}
              className="group relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span
                  className="font-impact text-xl sm:text-4xl tracking-wider text-white drop-shadow-lg"
                  style={{
                    WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
                  }}
                >
                  {member.name}
                </span>
              </div>
              {/* Hover color bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-2"
                style={{ backgroundColor: member.color }}
              />
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          {/* Modal content */}
          <div
            className="relative w-full max-w-[900px] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            style={{ animation: "modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-xl"
            >
              &times;
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Photo side */}
              <div className="relative w-full md:w-1/2 aspect-[3/4] bg-black flex-shrink-0">
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  className="object-cover object-top"
                />
                {/* Color accent bar at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: selectedMember.color }}
                />
              </div>

              {/* Info side */}
              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative overflow-hidden overflow-y-auto max-h-[90vh] md:max-h-none">
                {/* Background accent */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
                  style={{ backgroundColor: selectedMember.color }}
                />

                {/* Name */}
                <div className="mb-6">
                  <h3
                    className="font-impact text-4xl md:text-5xl tracking-wider"
                    style={{ color: selectedMember.color }}
                  >
                    {selectedMember.name}
                  </h3>
                  <p className="text-lg font-bold mt-1">{selectedMember.realName}</p>
                  <div
                    className="mt-2 h-[2px] w-20"
                    style={{ backgroundColor: selectedMember.color }}
                  />
                </div>

                {/* Catchphrase */}
                <div className="mb-4">
                  <p className="text-sm font-bold leading-relaxed">{selectedMember.catchphrase}</p>
                  <p
                    className="text-base font-black mt-1 tracking-wide"
                    style={{ color: selectedMember.color }}
                  >
                    {selectedMember.superCall}
                  </p>
                </div>

                {/* Birthday */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 tracking-widest mb-1">BIRTH</p>
                  <p className="text-base font-medium">{selectedMember.birthday}</p>
                </div>

                {/* SNS */}
                <div className="mt-auto pt-4">
                  <p className="text-xs text-gray-400 tracking-widest mb-3">SNS</p>
                  <div className="flex gap-3">
                    <a
                      href={selectedMember.sns.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 fill-gray-600" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    <a
                      href={selectedMember.sns.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 fill-gray-600" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </a>
                    <a
                      href={selectedMember.sns.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 fill-gray-600" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CSS animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modalSlideUp {
              from {
                opacity: 0;
                transform: translateY(40px) scale(0.96);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
