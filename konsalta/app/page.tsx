import Hero from "@/components/sections/hero";
import Partners from "@/components/sections/partners";
import Approach from "@/components/sections/approach";
import Clients from "@/components/sections/clients";
import Team from "@/components/sections/team";
import Strength from "@/components/sections/strength";

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
