"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Layers } from "lucide-react";
import { Hero } from "./Hero";
import { Problem } from "./Problem";
import { Market } from "./Market";
import { Solution } from "./Solution";
import { Product } from "./Product";
import { ProductFeatures } from "./ProductFeatures";
import { Business } from "./Business";
import { Competitive } from "./Competitive";
import { Future } from "./Future";
import { Closing } from "./Closing";

const NAV_ITEMS = [
  { id: "problem", label: "Problem" },
  { id: "market", label: "Market" },
  { id: "solution", label: "Solution" },
  { id: "product", label: "Product" },
  { id: "business", label: "Business" },
  { id: "competitive", label: "Competition" },
  { id: "future", label: "Roadmap" },
  { id: "closing", label: "Contact" },
];

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

function DeckNav() {
  const active = useActiveSection();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0e14]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-white/50 transition hover:text-white">
          <ArrowLeft size={15} />
        </Link>
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-400 to-brand-600 text-white">
            <Layers size={13} strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-white">Nodalis</span>
        </a>
        <nav className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                active === item.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function NodalisDeck() {
  return (
    <div className="min-h-screen bg-canvas">
      <DeckNav />
      <Hero />
      <Problem />
      <Market />
      <Solution />
      <Product />
      <ProductFeatures />
      <Business />
      <Competitive />
      <Future />
      <Closing />
    </div>
  );
}
