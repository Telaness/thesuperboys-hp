import sanitize from "sanitize-html";

/**
 * HTMLコンテンツをサニタイズしてXSS攻撃を防止する
 */
export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: [
      "p", "br", "b", "i", "u", "strong", "em", "s", "del",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img",
      "blockquote", "pre", "code",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span", "hr",
      "sub", "sup",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["class", "style", "id"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

/**
 * HTMLタグをエスケープする（プレーンテキスト用）
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
