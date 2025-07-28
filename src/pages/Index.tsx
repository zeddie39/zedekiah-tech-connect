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
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="pricing">
        {/* Pricing section prominently on the main page */}
        <HomePricingSection />
      </div>
      <div id="team">
        <Team />
      </div>
      <div id="blog">
        <Blog />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <div id="whychooseus">
        <WhyChooseUs />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
import HomePricingSection from "@/components/HomePricingSection";
export default Index;
