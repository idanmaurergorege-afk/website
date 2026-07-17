import { notFound } from "next/navigation";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getPaymentLink } from "@/lib/nodalis/links";
import { PosTerminal } from "@/components/nodalis-app/PosTerminal";

export default async function PosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = getPaymentLink(id);
  if (!link) notFound();

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const checkoutUrl = `${proto}://${host}/nodalis/app/pay/${link.id}`;

  const qrSvg = await QRCode.toString(checkoutUrl, {
    type: "svg",
    margin: 1,
    width: 220,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return <PosTerminal link={link} qrSvg={qrSvg} checkoutUrl={checkoutUrl} />;
}
