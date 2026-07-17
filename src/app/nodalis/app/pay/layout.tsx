import Link from "next/link";
import { Layers } from "lucide-react";

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border px-6 py-4">
        <Link href="/nodalis" className="flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-400 to-brand-600 text-white">
            <Layers size={13} strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-ink">Nodalis</span>
        </Link>
      </header>
      <main className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
