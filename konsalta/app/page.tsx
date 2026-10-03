import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Partners from "@/components/sections/partners";
import Approach from "@/components/sections/approach";
import Clients from "@/components/sections/clients";
import Team from "@/components/sections/team";
import Strength from "@/components/sections/strength";

export const metadata: Metadata = {
  title: "Better Decisions. Greater Impact.",
  description:
    "Konsalta is a women-led, Africa-focused research, consulting and advisory firm delivering evidence-informed decisions and lasting impact.",
  openGraph: {
    title: "Konsalta | Better Decisions. Greater Impact.",
    description:
      "Research, consulting and advisory for better decisions and greater impact.",
  },
};

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <Partners />
      <Approach />
      <Clients />
      <Team />
      <Strength />
    </div>
  );
}
