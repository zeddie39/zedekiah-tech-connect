import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import Blog from "@/components/Blog";

function Index() {
  return (
    <div>
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <Team />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}
export default Index;
