import { redirect } from "next/navigation";
import { getMerchant } from "@/lib/nodalis/merchant";
import { NodalisAppNav } from "@/components/nodalis-app/NodalisAppNav";

// This layout reads live merchant state from SQLite on every request (via a
// plain synchronous db call, which Next's static analysis can't see as
// "dynamic"). Without this, Next prerenders the subtree once at build time
// — with no merchant yet — and would permanently bake in the onboarding
// redirect regardless of what happens afterwards.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const merchant = getMerchant();
  if (!merchant || merchant.status !== "active") {
    redirect("/nodalis/app/onboarding");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <NodalisAppNav businessName={merchant.businessName} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
