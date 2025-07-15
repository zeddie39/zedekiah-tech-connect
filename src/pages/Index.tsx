import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import Blog from "@/components/Blog";
import FAQ from "@/pages/FAQ";
import WhyChooseUs from "@/pages/WhyChooseUs";

function Index() {
  return (
    <div>
      <Navigation />
      <Hero />
      <About />
      <Services />
      {/* Pricing section prominently on the main page */}
      <HomePricingSection />
      <Testimonials />
      <Team />
      <Blog />
      <FAQ />
      <WhyChooseUs />
      <Contact />
      <Footer />
    </div>
  );
}
import HomePricingSection from "@/components/HomePricingSection";
export default Index;
