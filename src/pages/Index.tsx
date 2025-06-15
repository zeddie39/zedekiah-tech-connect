
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import About from '../components/About';
import Services from '../components/Services';
import Team from '../components/Team';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Team />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
