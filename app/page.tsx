import { About } from "@/components/About";
import { BackToTop } from "@/components/BackToTop";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { CTA } from "@/components/CTA";
import { CursorBuddy } from "@/components/CursorBuddy";
import { Focus } from "@/components/Focus";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IntroSplash } from "@/components/IntroSplash";
import { Navbar } from "@/components/Navbar";
import { OceanBackdrop } from "@/components/OceanBackdrop";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <OceanBackdrop />
      <div className="ocean-ui flex min-h-full flex-col">
        <IntroSplash />
        <Navbar />
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
        <CursorBuddy />
      </div>
    </>
  );
}
