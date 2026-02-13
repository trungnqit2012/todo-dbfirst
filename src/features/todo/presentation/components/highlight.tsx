import React from "react";

export function highlightText(text: string, keyword: string): React.ReactNode {
  const trimmed = keyword.trim();
  if (!trimmed) return text;

  // tách keyword thành nhiều từ: "react query" → ["react", "query"]
  const words = trimmed
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.join("|")})`, "gi");

  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-slate-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
