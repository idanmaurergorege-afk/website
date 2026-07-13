import Parser from "rss-parser";
import type { Asset, NewsItem } from "../types";
import type { NewsProvider } from "./types";

const parser = new Parser({
  customFields: { item: [["source", "source"]] },
});

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { items: NewsItem[]; expiresAt: number }>();

function buildQuery(asset: Asset): string {
  switch (asset.category) {
    case "stock":
    case "crypto":
      return asset.name || asset.identifier;
    case "realestate":
      return `${asset.location ?? asset.name} real estate prices`;
    case "watch":
      return `${asset.name} ${asset.identifier} price`.trim();
    case "car":
      return asset.name || asset.identifier;
    case "metal":
      return `${asset.name} price`;
    case "other":
    default:
      return asset.newsKeyword || asset.name;
  }
}

async function fetchGoogleNews(query: string): Promise<NewsItem[]> {
  const cached = cache.get(query);
  if (cached && cached.expiresAt > Date.now()) return cached.items;

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const feed = await parser.parseURL(url);
    const items: NewsItem[] = (feed.items ?? []).slice(0, 3).map((item) => {
      const rawTitle = item.title ?? "";
      const sourceField = (item as unknown as { source?: string }).source;
      let title = rawTitle;
      let source = sourceField ?? "Google News";
      if (!sourceField) {
        const idx = rawTitle.lastIndexOf(" - ");
        if (idx > -1) {
          title = rawTitle.slice(0, idx);
          source = rawTitle.slice(idx + 3);
        }
      }
      return {
        title,
        url: item.link ?? "",
        publishedAt: item.pubDate ?? new Date().toISOString(),
        source,
      };
    });
    cache.set(query, { items, expiresAt: Date.now() + CACHE_TTL_MS });
    return items;
  } catch {
    return [];
  }
}

export const googleNewsProvider: NewsProvider = {
  async getNews(asset: Asset): Promise<NewsItem[]> {
    const query = buildQuery(asset);
    if (!query) return [];
    return fetchGoogleNews(query);
  },
};
