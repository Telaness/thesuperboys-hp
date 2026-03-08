import Header from "./Header";
import Footer from "./Footer";

interface DocumentPageProps {
  title: string;
  children: React.ReactNode;
}

export default function DocumentPage({ title, children }: DocumentPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="" />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="h-[2px] bg-black mt-3 mb-10" />
        <div className="text-sm leading-loose text-gray-800 whitespace-pre-wrap">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
