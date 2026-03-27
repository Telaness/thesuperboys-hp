"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  accentColor: string;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, accentColor, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);
  const fontSizePickerRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      // プレーンテキストの改行(\n)をHTMLの<br>に変換（既存データの互換性対応）
      const html = (value || "").replace(/\n/g, "<br>");
      editorRef.current.innerHTML = html;
      isInitializedRef.current = true;
    }
  }, [value]);

  // Reset initialization flag when component unmounts/remounts with new value
  useEffect(() => {
    return () => { isInitializedRef.current = false; };
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0).cloneRange());
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelection) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection);
      }
    }
  }, [savedSelection]);

  const execCommand = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  }, [handleInput]);

  const handleBold = () => execCommand("bold");
  const handleUnderline = () => execCommand("underline");

  const autoLinkLastUrl = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const textNode = range.startContainer;
    if (textNode.nodeType !== Node.TEXT_NODE) return;

    // Check if already inside an <a> tag
    let parent = textNode.parentElement;
    while (parent && parent !== editorRef.current) {
      if (parent.tagName === "A") return;
      parent = parent.parentElement;
    }

    const text = textNode.textContent || "";
    const cursorPos = range.startOffset;
    const textBeforeCursor = text.slice(0, cursorPos);

    const urlMatch = textBeforeCursor.match(/(https?:\/\/[^\s<]+)$/);
    if (!urlMatch || urlMatch.index === undefined) return;

    const url = urlMatch[1];
    const urlStart = urlMatch.index;
    const urlEnd = urlStart + url.length;

    const linkRange = document.createRange();
    linkRange.setStart(textNode, urlStart);
    linkRange.setEnd(textNode, urlEnd);

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = url;

    linkRange.deleteContents();
    linkRange.insertNode(link);

    // Move cursor after the link
    const newRange = document.createRange();
    newRange.setStartAfter(link);
    newRange.setEndAfter(link);
    sel.removeAllRanges();
    sel.addRange(newRange);

    handleInput();
  }, [handleInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      autoLinkLastUrl();
    }
  }, [autoLinkLastUrl]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    if (html) {
      // HTML形式がある場合はフォーマット（太字・リンク・色など）を保持してペースト
      document.execCommand("insertHTML", false, html);
    } else {
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    }
    // ペースト後にURL自動リンク化を実行
    setTimeout(() => autoLinkLastUrl(), 0);
  }, [autoLinkLastUrl]);

  const closeAllPopups = useCallback(() => {
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowFontSizePicker(false);
    setShowLinkInput(false);
  }, []);

  const handleColorClick = () => {
    saveSelection();
    const next = !showColorPicker;
    closeAllPopups();
    setShowColorPicker(next);
  };

  const handleColorSelect = (color: string) => {
    restoreSelection();
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const handleHighlightClick = () => {
    saveSelection();
    const next = !showHighlightPicker;
    closeAllPopups();
    setShowHighlightPicker(next);
  };

  const handleHighlightSelect = (color: string) => {
    restoreSelection();
    if (color === "transparent") {
      execCommand("removeFormat");
    } else {
      execCommand("hiliteColor", color);
    }
    setShowHighlightPicker(false);
  };

  const handleFontSizeClick = () => {
    saveSelection();
    const next = !showFontSizePicker;
    closeAllPopups();
    setShowFontSizePicker(next);
  };

  const handleFontSizeSelect = (size: string) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setShowFontSizePicker(false);
      return;
    }

    if (size === "standard") {
      // 標準：font-sizeのspanを除去してデフォルトに戻す
      execCommand("removeFormat");
    } else {
      // 一旦fontSize 7でマーカーとなるfontタグを挿入し、それをspanに置換する
      execCommand("fontSize", "7");
      if (editorRef.current) {
        const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
        fontElements.forEach((font) => {
          const span = document.createElement("span");
          span.style.fontSize = size;
          span.innerHTML = font.innerHTML;
          font.parentNode?.replaceChild(span, font);
        });
        handleInput();
      }
    }
    setShowFontSizePicker(false);
  };

  const handleLinkClick = () => {
    saveSelection();
    const next = !showLinkInput;
    closeAllPopups();
    setShowLinkInput(next);
    setLinkUrl("");
  };

  const handleLinkSubmit = () => {
    if (!linkUrl) return;
    restoreSelection();
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    execCommand("createLink", url);
    // Make link open in new tab
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll("a");
      links.forEach((link) => {
        if (!link.getAttribute("target")) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });
    }
    setShowLinkInput(false);
    setLinkUrl("");
    handleInput();
  };

  const handleUnlink = () => {
    restoreSelection();
    execCommand("unlink");
    setShowLinkInput(false);
  };

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
      if (highlightPickerRef.current && !highlightPickerRef.current.contains(e.target as Node)) {
        setShowHighlightPicker(false);
      }
      if (fontSizePickerRef.current && !fontSizePickerRef.current.contains(e.target as Node)) {
        setShowFontSizePicker(false);
      }
      if (linkInputRef.current && !linkInputRef.current.contains(e.target as Node)) {
        setShowLinkInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colors = [
    "#000000", "#e60012", "#0068b7", "#ff6600", "#009944",
    "#920783", "#f39800", "#1d2088", "#888888", "#ffffff",
  ];

  const highlightColors = [
    { color: "#ffff00", label: "黄色" },
    { color: "#ffeb3b", label: "レモン" },
    { color: "#00ff00", label: "緑" },
    { color: "#7cfc00", label: "黄緑" },
    { color: "#00ffff", label: "水色" },
    { color: "#87ceeb", label: "スカイブルー" },
    { color: "#ff69b4", label: "ピンク" },
    { color: "#ff99cc", label: "ライトピンク" },
    { color: "#ffa500", label: "オレンジ" },
    { color: "#ffcc80", label: "ライトオレンジ" },
    { color: "#e6b3ff", label: "ラベンダー" },
    { color: "#ff8a80", label: "レッド" },
    { color: "#d4edda", label: "ミント" },
    { color: "#d1c4e9", label: "パープル" },
    { color: "transparent", label: "解除" },
  ];

  const fontSizes = [
    { value: "0.85em", label: "小" },
    { value: "standard", label: "標準" },
    { value: "1.15em", label: "大" },
    { value: "1.35em", label: "特大" },
    { value: "1.6em", label: "極大" },
  ];

  const isPlaceholderVisible = !value || value === "" || value === "<br>";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 bg-gray-50 border border-gray-200 border-b-0 rounded-t-lg px-2 py-1.5">
        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleBold}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
          title="太字"
        >
          <span className="text-sm font-black text-gray-700">B</span>
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleUnderline}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
          title="下線"
        >
          <span className="text-sm font-medium text-gray-700 underline">U</span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Text Color */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleColorClick}
            className="w-7 h-7 flex flex-col items-center justify-center rounded hover:bg-gray-200 transition-colors"
            title="文字色"
          >
            <span className="text-sm font-bold text-gray-700 leading-none">A</span>
            <div className="w-4 h-1 rounded-sm mt-0.5" style={{ backgroundColor: accentColor }} />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 grid grid-cols-5 gap-1 w-[140px]">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleColorSelect(color)}
                  className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="relative" ref={fontSizePickerRef}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleFontSizeClick}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
            title="文字サイズ"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
          </button>

          {showFontSizePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 z-50 w-[80px]">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleFontSizeSelect(size.value)}
                  className="w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 transition-colors text-gray-700"
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Highlight */}
        <div className="relative" ref={highlightPickerRef}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleHighlightClick}
            className="w-7 h-7 flex flex-col items-center justify-center rounded hover:bg-gray-200 transition-colors"
            title="蛍光マーカー"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <div className="w-4 h-1 rounded-sm mt-0.5" style={{ backgroundColor: "#ffff00" }} />
          </button>

          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 grid grid-cols-5 gap-1 w-[160px]">
              {highlightColors.map((item) => (
                <button
                  key={item.color}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleHighlightSelect(item.color)}
                  className="w-6 h-6 rounded-sm border border-gray-200 hover:scale-110 transition-transform text-[9px] flex items-center justify-center"
                  style={{ backgroundColor: item.color === "transparent" ? "#f3f4f6" : item.color }}
                  title={item.label}
                >
                  {item.color === "transparent" ? "✕" : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-gray-300 mx-1" />

        {/* Hyperlink */}
        <div className="relative" ref={linkInputRef}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleLinkClick}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
            title="リンク"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-[260px]">
              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleLinkSubmit(); } }}
                  placeholder="https://..."
                  className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"
                  autoFocus
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleLinkSubmit}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600 transition-colors flex-shrink-0"
                >
                  設定
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleUnlink}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  解除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="w-full bg-gray-50 border border-gray-200 rounded-b-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all min-h-[120px] max-h-[300px] overflow-y-auto rich-text-content"
          style={{
            "--tw-ring-color": accentColor + "40",
            wordBreak: "break-word",
          } as React.CSSProperties}
          suppressContentEditableWarning
        />
        {isPlaceholderVisible && (
          <div className="absolute top-0 left-0 px-3 py-2.5 text-sm text-gray-400 pointer-events-none">
            {placeholder || "詳細情報を入力..."}
          </div>
        )}
      </div>
    </div>
  );
}
