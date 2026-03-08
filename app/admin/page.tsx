"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

type Tab = "live_events" | "news" | "media" | "discography";

interface LiveEvent {
  id: string;
  title: string;
  date: string;
  detail: string;
  published: boolean;
  image_url: string;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  detail: string;
  published: boolean;
  image_url: string;
}

interface MediaItem {
  id: string;
  title: string;
  date: string;
  detail: string;
  published: boolean;
  image_url: string;
}

interface DiscographyItem {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  published: boolean;
}

type ContentItem = LiveEvent | NewsItem | MediaItem | DiscographyItem;

const tabConfig = {
  live_events: {
    label: "LIVE / EVENT",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    color: "#e60012",
    imageRequired: false,
  },
  news: {
    label: "NEWS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    color: "#0068b7",
    imageRequired: false,
  },
  media: {
    label: "MEDIA",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    color: "#ff6600",
    imageRequired: true,
  },
  discography: {
    label: "DISCOGRAPHY",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "#999999",
    imageRequired: true,
  },
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(true);

  const [tab, setTab] = useState<Tab>("live_events");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setLoggedIn(true);
      setChecking(false);
    });
  }, []);

  // On desktop, default sidebar open
  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("メールアドレスまたはパスワードが正しくありません。");
    } else {
      setLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  };

  const fetchItems = useCallback(async () => {
    const query = supabase.from(tab).select("*");
    if (tab === "discography") {
      query.order("created_at", { ascending: false });
    } else {
      query.order("date", { ascending: false });
    }
    const { data } = await query;
    setItems(data || []);
  }, [tab]);

  useEffect(() => {
    if (loggedIn) fetchItems();
  }, [loggedIn, fetchItems]);

  const handleNew = () => {
    if (tab === "discography") {
      setEditing({ id: "", title: "", image_url: "", link_url: "", published: true } as DiscographyItem);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setEditing({ id: "", title: "", date: today, detail: "", published: true, image_url: "" });
    }
    setIsNew(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (item: ContentItem) => {
    setEditing({ ...item });
    setIsNew(false);
    setImageFile(null);
    setImagePreview(item.image_url || null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${tab}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!editing) return;

    if ((tab === "media" || tab === "discography") && !editing.image_url && !imageFile) {
      alert("画像は必須です。");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = editing.image_url || "";

      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      const { id, ...rest } = { ...editing, image_url: imageUrl };

      if (isNew) {
        await supabase.from(tab).insert(rest);
      } else {
        await supabase.from(tab).update(rest).eq("id", id);
      }

      setEditing(null);
      setIsNew(false);
      setImageFile(null);
      setImagePreview(null);
      fetchItems();
    } catch (err) {
      alert("保存に失敗しました。" + (err instanceof Error ? err.message : ""));
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    await supabase.from(tab).delete().eq("id", id);
    fetchItems();
  };

  const handleTogglePublish = async (item: ContentItem) => {
    await supabase.from(tab).update({ published: !item.published }).eq("id", item.id);
    fetchItems();
  };

  const updateField = (field: string, value: string | boolean) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("画像サイズは5MB以下にしてください。");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (editing) {
      setEditing({ ...editing, image_url: "" });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const publishedCount = items.filter((i) => i.published).length;
  const draftCount = items.filter((i) => !i.published).length;

  // Loading
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/50 text-sm tracking-wider">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">ADMIN</h1>
            <p className="text-sm text-white/40 mt-1 tracking-wider">THE超BOYS 管理画面</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wider uppercase">パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              {loginError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <p className="text-red-400 text-xs">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-white text-gray-900 rounded-xl py-3.5 text-sm font-bold hover:bg-white/90 transition-all active:scale-[0.98] mt-2"
              >
                ログイン
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  const config = tabConfig[tab];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-40 transition-transform duration-300 flex flex-col w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">S</span>
            </div>
            <div className="overflow-hidden lg:hidden" style={sidebarOpen ? {} : { display: "none" }}>
              <p className="text-sm font-bold tracking-wider whitespace-nowrap">THE超BOYS</p>
              <p className="text-[10px] text-white/40 tracking-wider whitespace-nowrap">ADMIN PANEL</p>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden hidden lg:block">
                <p className="text-sm font-bold tracking-wider whitespace-nowrap">THE超BOYS</p>
                <p className="text-[10px] text-white/40 tracking-wider whitespace-nowrap">ADMIN PANEL</p>
              </div>
            )}
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white/50 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase px-3 py-2">
            コンテンツ管理
          </p>
          {(Object.entries(tabConfig) as [Tab, typeof config][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setEditing(null); setImageFile(null); setImagePreview(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === key
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              <span className="flex-shrink-0" style={tab === key ? { color: cfg.color } : undefined}>
                {cfg.icon}
              </span>
              <span className="whitespace-nowrap">{cfg.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="whitespace-nowrap">ログアウト</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-20 transition-all duration-300">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.color + "15", color: config.color }}>
                {config.icon}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-gray-900">{config.label}</h1>
            </div>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97] shadow-lg"
              style={{ backgroundColor: config.color }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="hidden sm:inline">新規作成</span>
              <span className="sm:hidden">追加</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">全件数</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">公開中</p>
              <p className="text-xl sm:text-3xl font-bold text-green-600 mt-1">{publishedCount}</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-5 shadow-sm">
              <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider">下書き</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-400 mt-1">{draftCount}</p>
            </div>
          </div>

          {/* Item list - table on desktop, cards on mobile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {items.length === 0 ? (
              <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-gray-400">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <p className="text-sm font-medium">データがありません</p>
                <p className="text-xs text-gray-300 mt-1">「新規作成」ボタンから追加してください</p>
              </div>
            ) : (
              <>
                {/* Desktop table header */}
                <div className={`hidden md:grid gap-4 px-6 py-3.5 border-b border-gray-100 bg-gray-50/50 ${tab === "discography" ? "grid-cols-[100px_60px_1fr_140px]" : "grid-cols-[100px_60px_120px_1fr_140px]"}`}>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ステータス</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">画像</span>
                  {tab !== "discography" && <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">日付</span>}
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">タイトル</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">操作</span>
                </div>

                {items.map((item, index) => (
                  <div key={item.id}>
                    {/* Desktop row */}
                    <div
                      className={`hidden md:grid gap-4 px-6 py-3 items-center transition-colors hover:bg-gray-50/80 ${tab === "discography" ? "grid-cols-[100px_60px_1fr_140px]" : "grid-cols-[100px_60px_120px_1fr_140px]"} ${
                        index !== items.length - 1 ? "border-b border-gray-50" : ""
                      }`}
                    >
                      <div>
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all active:scale-95 ${
                            item.published
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.published ? "bg-green-500" : "bg-gray-300"}`} />
                          {item.published ? "公開" : "非公開"}
                        </button>
                      </div>
                      <div>
                        {item.image_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 relative">
                            <Image src={item.image_url} alt="" fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {tab !== "discography" && (
                        <div className="text-sm text-gray-400 tabular-nums whitespace-nowrap">
                          {"date" in item ? (item as LiveEvent).date : ""}
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          削除
                        </button>
                      </div>
                    </div>

                    {/* Mobile card */}
                    <div className={`md:hidden px-4 py-3 ${index !== items.length - 1 ? "border-b border-gray-100" : ""}`}>
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {item.image_url ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative">
                              <Image src={item.image_url} alt="" fill className="object-cover" sizes="48px" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${item.published ? "bg-green-500" : "bg-gray-300"}`} />
                              {item.published ? "公開" : "非公開"}
                            </span>
                            {tab !== "discography" && "date" in item && (
                              <span className="text-[11px] text-gray-400">{(item as LiveEvent).date}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          {item.published ? "非公開にする" : "公開する"}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-red-400 hover:bg-red-50 transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4" onClick={() => { setEditing(null); setImageFile(null); setImagePreview(null); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full sm:max-w-[560px] max-h-[90vh] sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: config.color }}
                >
                  {isNew ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">{isNew ? "新規作成" : "編集"}</h2>
              </div>
              <button
                onClick={() => { setEditing(null); setImageFile(null); setImagePreview(null); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  画像 {config.imageRequired && <span className="text-red-500">*必須</span>}
                </label>

                {imagePreview ? (
                  <div className="relative group">
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={imagePreview}
                        alt="プレビュー"
                        fill
                        className="object-cover"
                        sizes="500px"
                        unoptimized={imagePreview.startsWith("data:")}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-lg"
                        >
                          変更
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-4 py-2 bg-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-colors shadow-lg"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    {/* Mobile image actions (no hover on mobile) */}
                    <div className="flex gap-2 mt-2 sm:hidden">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-600"
                      >
                        画像を変更
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-2 bg-red-50 rounded-lg text-xs font-medium text-red-500"
                      >
                        削除
                      </button>
                    </div>
                    {imageFile && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <polyline points="13 2 13 9 20 9" />
                        </svg>
                        {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">タップして画像を選択</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (最大 5MB)</p>
                    </div>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">タイトル</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                  style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties}
                  placeholder="タイトルを入力..."
                />
              </div>

              {tab !== "discography" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">日付</label>
                  <input
                    type="date"
                    value={"date" in editing ? (editing as LiveEvent).date : ""}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                    style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties}
                  />
                </div>
              )}

              {tab === "discography" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Apple Music リンク <span className="text-red-500">*必須</span>
                  </label>
                  <input
                    type="url"
                    value={"link_url" in editing ? (editing as DiscographyItem).link_url : ""}
                    onChange={(e) => updateField("link_url", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                    style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties}
                    placeholder="https://music.apple.com/..."
                  />
                </div>
              )}

              {tab !== "discography" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">詳細</label>
                  <textarea
                    value={"detail" in editing ? (editing as LiveEvent).detail || "" : ""}
                    onChange={(e) => updateField("detail", e.target.value)}
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all resize-vertical"
                    style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties}
                    placeholder="詳細情報を入力..."
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => updateField("published", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow-sm after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-sm text-gray-600">{editing.published ? "公開" : "非公開（下書き）"}</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex justify-end gap-3">
              <button
                onClick={() => { setEditing(null); setImageFile(null); setImagePreview(null); }}
                className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.title || (tab !== "discography" && !("date" in editing && (editing as LiveEvent).date)) || (tab === "discography" && !("link_url" in editing && (editing as DiscographyItem).link_url))}
                className="px-5 sm:px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 hover:opacity-90 active:scale-[0.97] shadow-lg"
                style={{ backgroundColor: config.color }}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploading ? "アップロード中..." : "保存中..."}
                  </span>
                ) : "保存する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
