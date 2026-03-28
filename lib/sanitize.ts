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
    allowedStyles: {
      "*": {
        color: [/.*/],
        "background-color": [/.*/],
        "font-size": [/.*/],
        "text-decoration": [/.*/],
      },
    },
    transformTags: {
      // execCommand("foreColor") が生成する <font color="..."> を <span style="color: ..."> に変換
      font: (tagName: string, attribs: Record<string, string>) => {
        const styles: string[] = [];
        if (attribs.color) styles.push(`color: ${attribs.color}`);
        if (attribs.size) {
          const sizeMap: Record<string, string> = {
            "1": "0.625em", "2": "0.8125em", "3": "1em",
            "4": "1.125em", "5": "1.5em", "6": "2em", "7": "3em",
          };
          styles.push(`font-size: ${sizeMap[attribs.size] || "1em"}`);
        }
        return {
          tagName: "span",
          attribs: {
            style: styles.join("; "),
          },
        };
      },
    },
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
