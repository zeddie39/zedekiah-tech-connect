import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

function Index() {
  return (
    <div>
      <Navigation />
      <Hero />
      <Services />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
export default Index;
