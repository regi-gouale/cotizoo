import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-background to-primary/10 font-sans">
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
