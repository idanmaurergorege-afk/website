"use client";

import { useEffect, useState } from "react";
import { Newspaper, ExternalLink } from "lucide-react";
import type { NewsItem } from "@/lib/types";

export function NewsList({ assetId }: { assetId: string }) {
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?assetId=${assetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setNews(data.news ?? []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [assetId]);

  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
        <Newspaper size={11} />
        Recent news
      </p>
      {news === null && !failed && (
        <div className="space-y-1.5">
          <div className="h-3 w-5/6 animate-pulse rounded bg-surface-3" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-surface-3" />
        </div>
      )}
      {failed && <p className="text-xs text-ink-faint">Couldn&apos;t load news right now.</p>}
      {news !== null && news.length === 0 && (
        <p className="text-xs text-ink-faint">No recent headlines found.</p>
      )}
      <ul className="space-y-1.5">
        {news?.map((item, i) => (
          <li key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-1.5 text-xs text-ink-dim transition-colors hover:text-brand-400"
            >
              <ExternalLink size={11} className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
              <span className="line-clamp-2">
                {item.title} <span className="text-ink-faint">— {item.source}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
