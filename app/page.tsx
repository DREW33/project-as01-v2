import { LeadModalProvider } from "@/components/LeadModalContext";
import SmoothScroll from "@/components/SmoothScroll";
import RobotStage from "@/components/RobotStage";
import SideRail from "@/components/SideRail";
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
import BusinessAudit from "@/components/BusinessAudit";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";
import ChatWidget from "@/components/ChatWidget";
import VoiceAgent from "@/components/VoiceAgent";
import WorkShowcase from "@/components/WorkShowcase";

export default function Home() {
  return (
    <LeadModalProvider>
      {/* z0 light-gray geometric environment + z10 floating dark stage card
          (home page only — keeps it off the admin dashboard) */}
      <div className="env-bg" aria-hidden />
      <div className="stage-bg" aria-hidden />
      <LoadingScreen />
      <SmoothScroll />
      <ScrollProgress />
      {/* z20 — the central 3D robot, floating inside the dark stage card */}
      <RobotStage />
      <SideRail />
      <Navbar />
      {/* z30 — all content scrolls above the robot */}
      <main className="stage-content">
        {/* The robot is pinned/centered through this opening zone, then
            releases for the dense content sections below. */}
        <div id="stage-zone">
          <Hero />
        </div>
        <Services />
        <Projects />
        <TechMarquee />
        <Journey />
        <Pricing />
        <Testimonials />
        <BusinessAudit />
        <LocalSeo />
        <Contact />
      </main>
      <div className="stage-content">
        <Footer />
      </div>
      <LeadModal />
      <WorkShowcase />
      <ChatWidget />
      <VoiceAgent />
    </LeadModalProvider>
  );
}
