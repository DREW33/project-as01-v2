import { LeadModalProvider } from "@/components/LeadModalContext";
import Particles from "@/components/Particles";
import CursorGlow from "@/components/CursorGlow";
import ScrollProgress from "@/components/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";
import TechMarquee from "@/components/TechMarquee";
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
import VoiceAgent from "@/components/VoiceAgent";

export default function Home() {
  return (
    <LeadModalProvider>
      <LoadingScreen />
      <ScrollProgress />
      <Particles />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
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
      <VoiceAgent />
    </LeadModalProvider>
  );
}
