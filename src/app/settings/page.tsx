import { Nav } from "@/components/Nav";
import { SettingsForm } from "@/components/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-ink-faint">
          Optional API keys for live pricing on categories that don&apos;t have a free official API.
          Everything here is stored locally in <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">data/config.json</code>{" "}
          on this machine and is only ever sent to the provider it belongs to — never anywhere else.
        </p>
        <SettingsForm />
      </div>
    </div>
  );
}
