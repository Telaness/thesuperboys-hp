"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import RichTextEditor from "./RichTextEditor";

type Tab = "live_events" | "news" | "media" | "discography" | "footer_pages";

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

interface FooterPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: boolean;
}

type ContentItem = LiveEvent | NewsItem | MediaItem | DiscographyItem | FooterPage;

const tabConfig = {
  live_events: {
    label: "LIVE / EVENT",
    shortLabel: "LIVE",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    shortLabel: "NEWS",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    shortLabel: "MEDIA",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    color: "#ff6600",
    imageRequired: true,
  },
  discography: {
    label: "DISCOGRAPHY",
    shortLabel: "DISC",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "#999999",
    imageRequired: true,
  },
  footer_pages: {
    label: "PAGES",
    shortLabel: "PAGES",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    color: "#6b7280",
    imageRequired: false,
  },
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(true);

  const [tab, setTab] = useState<Tab>("live_events");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const editingRef = useRef<ContentItem | null>(null);
  // editingが更新されるたびにrefも同期
  useEffect(() => { editingRef.current = editing; }, [editing]);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // アカウント設定
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"email" | "password">("email");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLoggedIn(true);
        setCurrentUserEmail(data.session.user.email ?? "");
      }
      setChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("メールアドレスまたはパスワードが正しくありません。");
    } else {
      setLoggedIn(true);
      setCurrentUserEmail(data.user?.email ?? "");
    }
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setCurrentPassword("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setSettingsMessage(null);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !currentPassword) return;
    setSettingsSaving(true);
    setSettingsMessage(null);
    try {
      // 現在のパスワードで再認証
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: currentUserEmail,
        password: currentPassword,
      });
      if (authError) {
        setSettingsMessage({ type: "error", text: "現在のパスワードが正しくありません。" });
        return;
      }
      const { error } = await supabase.auth.updateUser(
        { email: newEmail },
        { emailRedirectTo: `${window.location.origin}/auth/confirm` }
      );
      if (error) {
        setSettingsMessage({ type: "error", text: error.message });
      } else {
        setSettingsMessage({ type: "success", text: "確認メールを送信しました。メール内のリンクをクリックして変更を完了してください。" });
        setCurrentPassword("");
        setNewEmail("");
      }
    } catch {
      setSettingsMessage({ type: "error", text: "エラーが発生しました。" });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword.length < 8) {
      setSettingsMessage({ type: "error", text: "新しいパスワードは8文字以上で入力してください。" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSettingsMessage({ type: "error", text: "新しいパスワードが一致しません。" });
      return;
    }
    setSettingsSaving(true);
    setSettingsMessage(null);
    try {
      // 現在のパスワードで再認証
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: currentUserEmail,
        password: currentPassword,
      });
      if (authError) {
        setSettingsMessage({ type: "error", text: "現在のパスワードが正しくありません。" });
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setSettingsMessage({ type: "error", text: error.message });
      } else {
        setSettingsMessage({ type: "success", text: "パスワードを変更しました。" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setSettingsMessage({ type: "error", text: "エラーが発生しました。" });
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  };

  const fetchItems = useCallback(async () => {
    const query = supabase.from(tab).select("*");
    if (tab === "discography" || tab === "footer_pages") {
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
    if (tab === "footer_pages") {
      setEditing({ id: "", slug: "", title: "", content: "", published: false } as FooterPage);
    } else if (tab === "discography") {
      setEditing({ id: "", title: "", image_url: "", link_url: "", published: false } as DiscographyItem);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setEditing({ id: "", title: "", date: today, detail: "", published: false, image_url: "" });
    }
    setIsNew(true);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (item: ContentItem) => {
    setEditing({ ...item });
    setIsNew(false);
    setImageFile(null);
    setImagePreview((item as LiveEvent).image_url || null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${tab}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    // refから最新のediting状態を取得（クロージャの古い値を回避）
    const current = editingRef.current;
    if (!current) return;
    if ((tab === "media" || tab === "discography") && !(current as LiveEvent).image_url && !imageFile) {
      alert("画像は必須です。");
      return;
    }
    setSaving(true);
    try {
      let saveData: Record<string, unknown>;

      if (tab === "footer_pages") {
        const fp = current as FooterPage;
        saveData = {
          slug: fp.slug,
          title: fp.title,
          content: fp.content,
          published: fp.published,
        };
      } else if (tab === "discography") {
        const disc = current as DiscographyItem;
        let imageUrl = disc.image_url || "";
        if (imageFile) {
          setUploading(true);
          imageUrl = await uploadImage(imageFile);
          setUploading(false);
        }
        saveData = {
          title: disc.title,
          image_url: imageUrl,
          link_url: disc.link_url,
          published: disc.published,
        };
      } else {
        const item = current as LiveEvent;
        let imageUrl = item.image_url || "";
        if (imageFile) {
          setUploading(true);
          imageUrl = await uploadImage(imageFile);
          setUploading(false);
        }
        saveData = {
          title: item.title,
          date: item.date,
          detail: item.detail,
          image_url: imageUrl,
          published: item.published,
        };
      }

      if (isNew) {
        const { error } = await supabase.from(tab).insert(saveData);
        if (error) { alert(`INSERT失敗: ${error.message}`); return; }
      } else {
        const { error } = await supabase.from(tab).update(saveData).eq("id", current.id);
        if (error) { alert(`UPDATE失敗: ${error.message}`); return; }
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
    setEditing(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("画像ファイルを選択してください。"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("画像サイズは5MB以下にしてください。"); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (editing) setEditing({ ...editing, image_url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => { setEditing(null); setImageFile(null); setImagePreview(null); };

  const publishedCount = items.filter((i) => i.published).length;
  const draftCount = items.filter((i) => !i.published).length;

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

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <div className="relative w-full max-w-[400px]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">ADMIN</h1>
            <p className="text-xs text-white/40 mt-1 tracking-wider">THE超BOYS 管理画面</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-white/50 mb-1.5 tracking-wider uppercase">メールアドレス</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                  placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-white/50 mb-1.5 tracking-wider uppercase">パスワード</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                    placeholder="••••••••" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <p className="text-red-400 text-xs">{loginError}</p>
                </div>
              )}
              <button type="submit" className="w-full bg-white text-gray-900 rounded-xl py-3 text-sm font-bold hover:bg-white/90 transition-all active:scale-[0.98]">
                ログイン
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const config = tabConfig[tab];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - hidden on mobile, icon-only on desktop */}
      <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-40 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0 w-60" : "-translate-x-full lg:translate-x-0 lg:w-[72px]"
      }`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[56px]">
          <div className="flex items-center gap-3">
            {sidebarOpen && (
              <div>
                <p className="text-xs font-bold tracking-wider whitespace-nowrap">THE超BOYS</p>
                <p className="text-[9px] text-white/40 tracking-wider whitespace-nowrap">ADMIN PANEL</p>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 flex items-center justify-center text-white/50 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {(Object.entries(tabConfig) as [Tab, typeof config][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setEditing(null); setImageFile(null); setImagePreview(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                tab === key ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              } ${!sidebarOpen ? "justify-center" : ""}`}
              title={cfg.label}
            >
              <span className="flex-shrink-0" style={tab === key ? { color: cfg.color } : undefined}>{cfg.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{cfg.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-white/10 space-y-0.5">
          <button onClick={() => { setSettingsOpen(true); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-all ${!sidebarOpen ? "justify-center" : ""}`}
            title="アカウント設定"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
            {sidebarOpen && <span className="whitespace-nowrap">アカウント設定</span>}
          </button>
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all ${!sidebarOpen ? "justify-center" : ""}`}
            title="ログアウト"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {sidebarOpen && <span className="whitespace-nowrap">ログアウト</span>}
          </button>
        </div>
      </aside>

      {/* Main content - no left margin on mobile */}
      <main className="w-full lg:pl-[72px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
          <div className="px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: config.color + "15", color: config.color }}>
                {config.icon}
              </div>
              <h1 className="text-sm font-bold text-gray-900 truncate">{config.label}</h1>
            </div>
            {tab !== "footer_pages" && (
              <button onClick={handleNew}
                className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ backgroundColor: config.color }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                追加
              </button>
            )}
          </div>
          {/* Mobile tab bar */}
          <div className="lg:hidden flex border-t border-gray-100 overflow-x-auto">
            {(Object.entries(tabConfig) as [Tab, typeof config][]).map(([key, cfg]) => (
              <button key={key}
                onClick={() => { setTab(key); setEditing(null); }}
                className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors border-b-2 ${
                  tab === key ? "border-current" : "border-transparent text-gray-400"
                }`}
                style={tab === key ? { color: cfg.color } : undefined}
              >
                {cfg.icon}
                <span className="truncate w-full text-center">{cfg.shortLabel}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="p-3 sm:p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg border border-gray-100 p-2.5 sm:p-4">
              <p className="text-[9px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider">全件数</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5">{items.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-2.5 sm:p-4">
              <p className="text-[9px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider">公開中</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5">{publishedCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-2.5 sm:p-4">
              <p className="text-[9px] sm:text-[11px] font-medium text-gray-400 uppercase tracking-wider">下書き</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-400 mt-0.5">{draftCount}</p>
            </div>
          </div>

          {/* Item list */}
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {items.length === 0 ? (
              <div className="py-12 sm:py-20 flex flex-col items-center justify-center text-gray-400 px-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <p className="text-sm font-medium">データがありません</p>
                <p className="text-xs text-gray-300 mt-1">
                  {tab === "footer_pages" ? "データベースにページを登録してください" : "「追加」ボタンから作成してください"}
                </p>
              </div>
            ) : (
              <div>
                {/* Desktop table header */}
                <div className={`hidden lg:grid gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50 ${
                  tab === "footer_pages" ? "grid-cols-[80px_120px_1fr_120px]" : tab === "discography" ? "grid-cols-[80px_48px_1fr_120px]" : "grid-cols-[80px_48px_100px_1fr_120px]"
                }`}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ステータス</span>
                  {tab === "footer_pages" ? (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">スラッグ</span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">画像</span>
                  )}
                  {tab !== "discography" && tab !== "footer_pages" && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">日付</span>}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">タイトル</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">操作</span>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className={index !== items.length - 1 ? "border-b border-gray-50 lg:border-gray-50" : ""}>
                    {/* Desktop row */}
                    <div className={`hidden lg:grid gap-3 px-4 py-2.5 items-center hover:bg-gray-50/80 ${
                      tab === "footer_pages" ? "grid-cols-[80px_120px_1fr_120px]" : tab === "discography" ? "grid-cols-[80px_48px_1fr_120px]" : "grid-cols-[80px_48px_100px_1fr_120px]"
                    }`}>
                      <div>
                        <button onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all active:scale-95 ${
                            item.published ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.published ? "bg-green-500" : "bg-gray-300"}`} />
                          {item.published ? "公開" : "非公開"}
                        </button>
                      </div>
                      {tab === "footer_pages" ? (
                        <div className="text-xs text-gray-500 font-mono truncate">{"slug" in item ? (item as FooterPage).slug : ""}</div>
                      ) : (
                        <div>
                          {(item as LiveEvent).image_url ? (
                            <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 relative">
                              <Image src={(item as LiveEvent).image_url} alt="" fill className="object-cover" sizes="36px" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                            </div>
                          )}
                        </div>
                      )}
                      {tab !== "discography" && tab !== "footer_pages" && (
                        <div className="text-xs text-gray-400 tabular-nums">{"date" in item ? (item as LiveEvent).date : ""}</div>
                      )}
                      <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                      <div className="flex items-center justify-end gap-0.5">
                        <button onClick={() => handleEdit(item)} className="px-2 py-1 rounded text-[11px] font-medium text-blue-600 hover:bg-blue-50 transition-colors">編集</button>
                        {tab !== "footer_pages" && (
                          <button onClick={() => handleDelete(item.id)} className="px-2 py-1 rounded text-[11px] font-medium text-red-400 hover:bg-red-50 transition-colors">削除</button>
                        )}
                      </div>
                    </div>

                    {/* Mobile card */}
                    <div className="lg:hidden px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {tab === "footer_pages" ? (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                          </div>
                        ) : (item as LiveEvent).image_url ? (
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 relative flex-shrink-0">
                            <Image src={(item as LiveEvent).image_url} alt="" fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{item.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold ${item.published ? "text-green-600" : "text-gray-400"}`}>
                              <span className={`w-1 h-1 rounded-full ${item.published ? "bg-green-500" : "bg-gray-300"}`} />
                              {item.published ? "公開" : "非公開"}
                            </span>
                            {tab === "footer_pages" && "slug" in item && (
                              <span className="text-[10px] text-gray-400 font-mono">{(item as FooterPage).slug}</span>
                            )}
                            {tab !== "discography" && tab !== "footer_pages" && "date" in item && (
                              <span className="text-[10px] text-gray-400">{(item as LiveEvent).date}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button onClick={() => handleEdit(item)} className="w-7 h-7 flex items-center justify-center rounded text-blue-500 hover:bg-blue-50">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          </button>
                          <button onClick={() => handleTogglePublish(item)} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {item.published
                                ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                              }
                            </svg>
                          </button>
                          {tab !== "footer_pages" && (
                            <button onClick={() => handleDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded text-red-400 hover:bg-red-50">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onMouseDown={closeModal} />
          <div className="relative w-full sm:max-w-[500px] max-h-[70vh] sm:max-h-[85vh] bg-white rounded-t-xl sm:rounded-xl shadow-2xl overflow-y-auto mx-3 sm:mx-4 mb-[env(safe-area-inset-bottom)]">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: config.color }}>
                  {isNew ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  )}
                </div>
                <h2 className="text-sm font-bold text-gray-900">{isNew ? "新規作成" : "編集"}</h2>
              </div>
              <button onClick={closeModal} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Slug display (footer_pages only) */}
              {tab === "footer_pages" && "slug" in editing && (editing as FooterPage).slug && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">URL:</span>
                  <span className="text-xs font-mono text-gray-600">/{(editing as FooterPage).slug}</span>
                </div>
              )}

              {/* Image (not for footer_pages) */}
              {tab !== "footer_pages" && <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                  画像 {config.imageRequired && <span className="text-red-500">*必須</span>}
                </label>
                {imagePreview ? (
                  <div>
                    <div className="relative w-full aspect-[2/1] sm:aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                      <Image src={imagePreview} alt="プレビュー" fill className="object-cover" sizes="500px" unoptimized={imagePreview.startsWith("data:")} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex-1 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors">
                        変更
                      </button>
                      <button type="button" onClick={handleRemoveImage}
                        className="px-3 py-1.5 bg-red-50 rounded-lg text-xs font-medium text-red-500 hover:bg-red-100 transition-colors">
                        削除
                      </button>
                    </div>
                    {imageFile && (
                      <p className="mt-1 text-[10px] text-gray-400 truncate">{imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                    )}
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[2/1] sm:aspect-[16/9] rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 bg-gray-50 transition-all flex flex-col items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    <p className="text-xs text-gray-500">タップして画像を選択</p>
                    <p className="text-[10px] text-gray-400">JPG, PNG, WebP (最大 5MB)</p>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>}

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">タイトル</label>
                <input type="text" value={editing.title} onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                  style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties}
                  placeholder="タイトルを入力..." />
              </div>

              {tab !== "discography" && tab !== "footer_pages" && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">日付</label>
                  <input type="date" value={"date" in editing ? (editing as LiveEvent).date : ""}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                    style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties} />
                </div>
              )}

              {tab === "discography" && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                    リンク <span className="text-red-500">*必須</span>
                  </label>
                  <input type="url" value={"link_url" in editing ? (editing as DiscographyItem).link_url : ""}
                    onChange={(e) => updateField("link_url", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                    style={{ "--tw-ring-color": config.color + "40" } as React.CSSProperties}
                    placeholder="https://..." />
                </div>
              )}

              {tab !== "discography" && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {tab === "footer_pages" ? "コンテンツ" : "詳細"}
                  </label>
                  <RichTextEditor
                    value={tab === "footer_pages"
                      ? ("content" in editing ? (editing as FooterPage).content || "" : "")
                      : ("detail" in editing ? (editing as LiveEvent).detail || "" : "")}
                    onChange={(html) => updateField(tab === "footer_pages" ? "content" : "detail", html)}
                    accentColor={config.color}
                    placeholder={tab === "footer_pages" ? "ページ内容を入力..." : "詳細情報を入力..."}
                  />
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={editing.published} onChange={(e) => updateField("published", e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-xs text-gray-600">{editing.published ? "公開" : "非公開"}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100">キャンセル</button>
              <button onClick={handleSave}
                disabled={saving || !editing.title || (tab !== "discography" && tab !== "footer_pages" && !("date" in editing && (editing as LiveEvent).date)) || (tab === "discography" && !("link_url" in editing && (editing as DiscographyItem).link_url))}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-40 hover:opacity-90 active:scale-[0.97]"
                style={{ backgroundColor: config.color }}>
                {saving ? (
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {uploading ? "アップロード中..." : "保存中..."}
                  </span>
                ) : "保存する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onMouseDown={closeSettings} />
          <div className="relative w-full sm:max-w-[440px] bg-white rounded-t-xl sm:rounded-xl shadow-2xl mx-3 sm:mx-4">
            {/* Header */}
            <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-gray-900">アカウント設定</h2>
              </div>
              <button onClick={closeSettings} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Current email display */}
            <div className="px-4 pt-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">現在のメールアドレス</p>
              <p className="text-sm text-gray-700 mt-0.5">{currentUserEmail}</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mx-4 mt-3">
              <button
                onClick={() => { setSettingsTab("email"); setSettingsMessage(null); }}
                className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
                  settingsTab === "email" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                メールアドレス変更
              </button>
              <button
                onClick={() => { setSettingsTab("password"); setSettingsMessage(null); }}
                className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
                  settingsTab === "password" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                パスワード変更
              </button>
            </div>

            {/* Tab content */}
            <div className="p-4">
              {settingsMessage && (
                <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4 ${
                  settingsMessage.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={settingsMessage.type === "success" ? "#16a34a" : "#ef4444"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    {settingsMessage.type === "success"
                      ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
                      : <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
                    }
                  </svg>
                  <p className={`text-xs ${settingsMessage.type === "success" ? "text-green-700" : "text-red-600"}`}>
                    {settingsMessage.text}
                  </p>
                </div>
              )}

              {settingsTab === "email" ? (
                <form onSubmit={handleEmailChange} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">新しいメールアドレス</label>
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
                      placeholder="new@example.com" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">現在のパスワード（確認用）</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
                      placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={settingsSaving || !newEmail || !currentPassword}
                    className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-xs font-bold hover:bg-gray-800 disabled:opacity-40 transition-all active:scale-[0.98]">
                    {settingsSaving ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        変更中...
                      </span>
                    ) : "メールアドレスを変更"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">現在のパスワード</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
                      placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">新しいパスワード（8文字以上）</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
                      placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">新しいパスワード（確認）</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
                      placeholder="••••••••" />
                  </div>
                  <button type="submit" disabled={settingsSaving || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-xs font-bold hover:bg-gray-800 disabled:opacity-40 transition-all active:scale-[0.98]">
                    {settingsSaving ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        変更中...
                      </span>
                    ) : "パスワードを変更"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
