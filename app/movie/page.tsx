import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";

const movies = [
  {
    title: "THE超BOYS「恋せよ乙女、愛せよ漢」Music Video",
    youtubeId: "Hg1r-S5ooQc?si=CINgIX2szVPPWKpy",
  },
];

export default function MoviePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/movie" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#f5c500">MOVIE</SectionHeading>
        <p className="section-subtitle mb-16">ミュージックビデオ情報</p>

        <div className="space-y-16">
          {movies.map((movie, i) => (
            <div key={i} className="group">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${movie.youtubeId}`}
                  title={movie.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-700">「恋せよ乙女、愛せよ漢」Music Video</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
