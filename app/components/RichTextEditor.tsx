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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
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

  const handleColorClick = () => {
    saveSelection();
    setShowColorPicker(!showColorPicker);
    setShowLinkInput(false);
  };

  const handleColorSelect = (color: string) => {
    restoreSelection();
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const handleLinkClick = () => {
    saveSelection();
    setShowLinkInput(!showLinkInput);
    setShowColorPicker(false);
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
