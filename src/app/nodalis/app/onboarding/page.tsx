import { redirect } from "next/navigation";
import { getMerchant } from "@/lib/nodalis/merchant";
import { OnboardingWizard } from "@/components/nodalis-app/OnboardingWizard";

// Reads live merchant state on every request — see the (dashboard) layout
// for why this must not be statically prerendered.
export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  const merchant = getMerchant();
  if (merchant?.status === "active") {
    redirect("/nodalis/app");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <OnboardingWizard initialMerchant={merchant ?? null} />
    </div>
  );
}
