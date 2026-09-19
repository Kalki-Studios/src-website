import Navbar from "@/components/Navbar";
import HeroStepOne from "@/components/HeroStepOne";
import TechStack from "@/components/TechStack";
import HowItWorks from "@/components/HowItWorks";
import Portfolio from "@/components/Portfolio";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroStepOne />
        <TechStack />
        <HowItWorks />
        <Portfolio />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
