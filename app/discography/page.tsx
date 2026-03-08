import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";

const releases = [
  {
    title: "恋せよ乙女、愛せよ漢",
    image: "/single_jacket.jpg",
  },
];

export default function DiscographyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/discography" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#999999">DISCOGRAPHY</SectionHeading>
        <p className="section-subtitle mb-16">配信楽曲情報</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {releases.map((release, i) => (
            <div key={i} className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow">
                <Image
                  src={release.image}
                  alt={release.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
