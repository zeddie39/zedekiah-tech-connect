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
      <section className="hero-pattern py-20 px-4 text-center flex flex-col items-center">
        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-primary text-white px-6 py-3 rounded-md font-bold text-lg shadow hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/auth"
            className="bg-secondary text-primary px-6 py-3 rounded-md font-bold text-lg border border-primary hover:bg-secondary/70 transition"
          >
            Login / Signup
          </Link>
        </div>
      </section>
      <Services />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}

export default Index;
