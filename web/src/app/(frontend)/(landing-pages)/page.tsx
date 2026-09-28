import Navbar from "@/components/base/nav";
import Hero from "./components/Hero";
import EnergyChart from "./components/EnergyChart";
import HydrogenCycle from "./components/HydrogenCycle";
import LatestPosts from "./components/LatestPosts";
import AskAssistant from "./components/AskAssistant";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <EnergyChart />
        <HydrogenCycle />
        <LatestPosts />
        <AskAssistant />
      </main>
      <Footer />
    </div>
  );
}
