import { CheckoutPage } from "@/components/nodalis-app/CheckoutPage";

export default async function PayPage({ params }: { params: Promise<{ linkId: string }> }) {
  const { linkId } = await params;
  return <CheckoutPage linkId={linkId} />;
}
