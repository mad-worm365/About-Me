import { About } from "@/components/About";
import { BackToTop } from "@/components/BackToTop";
import { Blog } from "@/components/Blog";
import { ClickSparkles } from "@/components/ClickSparkles";
import { Contact } from "@/components/Contact";
import { CTA } from "@/components/CTA";
import { Focus } from "@/components/Focus";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IntroSplash } from "@/components/IntroSplash";
import { Navbar } from "@/components/Navbar";
import { OceanBackdrop } from "@/components/OceanBackdrop";
import { OceanHUD } from "@/components/OceanHUD";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { WarpCTA } from "@/components/WarpCTA";

export default function Home() {
  return (
    <>
      <OceanBackdrop />
      <OceanHUD />
      <div className="ocean-ui flex min-h-full flex-col">
        <IntroSplash />
        <Navbar />
        <WarpCTA />
        <main>
          <Hero />
          <Stats />
          <About />
          <Skills />
          <Projects />
          <Focus />
          <CTA />
          <Testimonials />
          <Blog />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <ClickSparkles />
      </div>
    </>
  );
}
