import type { Metadata } from "next";
import { NodalisDeck } from "@/components/nodalis/NodalisDeck";

export const metadata: Metadata = {
  title: "Nodalis — Merchant Operating System for Digital Asset Payments",
  description:
    "One dashboard. Every licensed crypto payment provider. Zero blockchain complexity for merchants. Nodalis investor presentation, 2026.",
};

export default function NodalisPage() {
  return <NodalisDeck />;
}
