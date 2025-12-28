import { Hero } from "./_components/hero";
import { Features } from "./_components/features";
import { Navbar } from "./_components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
    </main>
  );
}
