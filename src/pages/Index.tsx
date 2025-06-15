import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

function Index() {
  return (
    <div>
      <Navbar />
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
