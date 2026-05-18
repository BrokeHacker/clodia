import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import HowItWorks from "@/components/HowItWorks";
import Formules from "@/components/Formules";
import PointsLivraison from "@/components/PointsLivraison";
import CtaWhatsApp from "@/components/CtaWhatsApp";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <Formules />
        <PointsLivraison />
        <CtaWhatsApp />
      </main>
      <Footer />
    </>
  );
}
