import { LeadModalProvider } from "@/components/LeadModalContext";
import Particles from "@/components/Particles";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Journey from "@/components/Journey";
import Testimonials from "@/components/Testimonials";
import LocalSeo from "@/components/LocalSeo";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <LeadModalProvider>
      <Particles />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Projects />
        <Services />
        <Journey />
        <Pricing />
        <Testimonials />
        <LocalSeo />
        <Contact />
      </main>
      <Footer />
      <LeadModal />
      <ChatWidget />
    </LeadModalProvider>
  );
}
