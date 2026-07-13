# Ledger — Personal Wealth Tracker

A local-first web app for logging every asset you own — stocks, crypto,
precious metals, real estate, watches, cars, or anything else — and seeing
its estimated value, historical trend, and recent news on one dashboard.

Built with Next.js (App Router) + SQLite (`better-sqlite3`). No account, no
cloud sync: everything lives in a SQLite file on your machine.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). A `data/wealth.db`
SQLite file is created automatically on first run.

## How value data works: Live vs. Index estimate vs. Manual

Every asset card shows a badge telling you exactly how trustworthy its
current value is:

| Badge | Meaning |
|---|---|
| **Live** | Fetched just now from a real pricing API (stocks, crypto, or gold/silver spot). |
| **Index estimate** | No per-asset live price exists, so the value is extrapolated from a regional/market index (currently: real estate, using the Case-Shiller national home price index). This is a trend estimate, not an appraisal. |
| **Manual** | You typed this number in yourself (or it's still just the purchase price because nothing else has been entered). |

The app never fabricates a live-looking number for a category it can't
actually price — categories without a working provider are always labeled
**Manual**.

Every time an asset is refreshed (via the per-card refresh button or "Refresh
all"), a timestamped snapshot is stored in `value_snapshots`, so even
manual-entry assets build a real history over time and get a sparkline —
it becomes a ledger, not just a single number.

## Data providers by category

| Category | Free path (no key) | Optional paid path |
|---|---|---|
| Stock / ETF | — | [Alpha Vantage](https://www.alphavantage.co/support/#api-key) `GLOBAL_QUOTE` (`ALPHA_VANTAGE_KEY`) |
| Crypto | [CoinGecko](https://www.coingecko.com/en/api) `/simple/price` (no key) | — |
| Precious metal | CoinGecko PAX Gold token price (gold only, no key) | [metals-api.com](https://metals-api.com/) spot price (`METALS_API_KEY`) |
| Real estate | Manual entry | [RentCast](https://www.rentcast.io/api) AVM (`REALESTATE_API_KEY`), or [FRED](https://fred.stlouisfed.org/docs/api/api_key.html) Case-Shiller index trend estimate (`FRED_API_KEY`) |
| Watch | Manual entry | Apify actor stub (`WATCH_DATA_API_KEY`) — see note below |
| Car | Manual entry | [MarketCheck](https://www.marketcheck.com/apis) VIN valuation (`CAR_DATA_API_KEY`) |
| Other | Manual entry only | — |
| News (all categories) | [Google News RSS](https://news.google.com/rss) search, filtered per asset (no key) | — |

**Important — what this app deliberately does *not* do:** Zillow shut down
its public API in 2021 and Chrono24 has no official API either. This app
does **not** scrape either site. Real estate defaults to manual entry (with
an optional paid RentCast integration, or a free Case-Shiller trend
estimate); watches default to manual entry, with an *optional*, off-by-default
stub for a user-supplied Apify scraping actor — enabling it means you are
accepting Chrono24's own Terms of Service risk yourself, not this app doing
it for you.

Stocks and crypto also need a `quantity` (shares / coins held) to turn a
live per-unit price into a total value — this field was added beyond the
original flat schema sketch since without it a single share's price would
be mistaken for the whole holding's value.

## Configuring API keys

Two equivalent ways to set keys, both server-only and never sent anywhere
except to the provider they belong to:

1. **`.env.local`** (standard Next.js env file, requires a dev-server
   restart to take effect):
   ```
   ALPHA_VANTAGE_KEY=...
   METALS_API_KEY=...
   REALESTATE_API_KEY=...
   FRED_API_KEY=...
   WATCH_DATA_API_KEY=...
   CAR_DATA_API_KEY=...
   ```
2. **Settings page** (`/settings` in the app) — pastes keys into
   `data/config.json`, applied immediately without a restart. Keys set via
   `.env.local` take priority and show as read-only ("set via .env.local").

Both `data/wealth.db` and `data/config.json` are gitignored and never leave
your machine.

## Refreshing prices

- The **Refresh** button on each card re-fetches that one asset's price.
- **Refresh all** (top of the dashboard) does the same for every asset.
- For an automatic daily refresh, point an external scheduler (a system
  cron job, GitHub Action, or Vercel Cron if deployed there) at
  `POST /api/refresh` — Next.js route handlers don't run background jobs on
  their own, so this has to be triggered from outside the app process.

## Project structure

```
src/
  app/
    page.tsx              dashboard
    settings/page.tsx      API key settings
    api/assets/            asset CRUD + per-asset refresh
    api/refresh/           refresh-all
    api/news/              on-demand news lookup
    api/settings/          read/write local API keys
  components/              dashboard, cards, forms, charts
  lib/
    db.ts                  SQLite schema + connection
    assets.ts               asset/snapshot data access
    config.ts               local API key storage
    providers/               PriceProvider + NewsProvider per category
```

## Notes on this sandbox environment

If you're testing this from a network-restricted environment, outbound
calls to CoinGecko / Alpha Vantage / Google News / etc. may be blocked —
assets will gracefully fall back to "Manual" instead of crashing. On a
normal machine with regular internet access, live data flows through
normally.
