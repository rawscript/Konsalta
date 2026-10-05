import type { Metadata } from "next";
import ContentPage from "@/app/content/page";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Konsalta Insights will share research, practical learning and strategic thinking that turns evidence into impact.",
  openGraph: {
    title: "Konsalta Insights",
    description:
      "Research, practical learning and strategic thinking from Konsalta.",
  },
};

export default function InsightsPage() {
  return <ContentPage />;
}
