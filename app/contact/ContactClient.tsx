"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";

export default function ContactClient() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastName, firstName, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "送信に失敗しました。");
      setSent(true);
      setLastName("");
      setFirstName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentPath="/contact" />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16">
        <SectionHeading color="#222222">CONTACT</SectionHeading>
        <p className="section-subtitle mb-12">お問い合わせ</p>

        <div className="max-w-[720px] border border-gray-200 rounded-xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Name */}
            <div>
              <p className="text-sm font-bold mb-4">名前</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    姓 <span className="text-red-500">(必須)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black transition-colors bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    名 <span className="text-red-500">(必須)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black transition-colors bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-bold mb-2 block">
                メール <span className="text-xs font-normal text-red-500">(必須)</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-bold mb-2 block">
                メッセージ <span className="text-xs font-normal text-red-500">(必須)</span>
              </label>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-black transition-colors bg-transparent resize-y"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {sent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">お問い合わせを送信しました。ありがとうございます。</p>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={sending}
                className="font-impact text-lg tracking-wider px-16 py-3 border border-gray-800 rounded-full hover:bg-black hover:text-white transition-colors disabled:opacity-40"
              >
                {sending ? "送信中..." : "送信"}
              </button>
            </div>
          </form>
        </div>

        {/* Notes */}
        <div className="max-w-[720px] mt-12 space-y-3 text-sm text-gray-600">
          <p className="font-bold text-gray-800">【お客様からのお問い合わせに関する注意事項】</p>
          <p>・お名前のご記載がないお問い合わせにつきましては、ご回答いたしかねる場合がございます。</p>
          <p>・いただいたすべてのお問い合わせに、個別でご返信できない場合がございます。あらかじめご了承ください。</p>
          <p>・内容によっては、ホームページ上でのお知らせをもって回答とさせていただく場合がございます。</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
