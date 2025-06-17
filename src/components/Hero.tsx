import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from "react-router-dom";
import RealtimeClock from "./RealtimeClock";

type Quote = {
  quote_text: string;
  author?: string | null;
};

const fallbackQuotes: Quote[] = [
  {
    quote_text: "Technology is best when it brings people together.",
    author: "Matt Mullenweg"
  },
  {
    quote_text: "Any sufficiently advanced technology is indistinguishable from magic.",
    author: "Arthur C. Clarke"
  },
  {
    quote_text: "We are changing the world with technology.",
    author: "Bill Gates"
  },
  {
    quote_text: "Electronics is the backbone of modern civilization.",
    author: "Zedekiah Team"
  },
  {
    quote_text: "Innovation in electronics powers the future.",
    author: "Zedekiah Team"
  }
];

const Hero = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch session on mount
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setSession(session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setSession(session);
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchDailyQuote = async () => {
      console.log("[Hero] Fetching daily quote...");
      const startTime = performance.now();
      const { data, error } = await supabase
        .from('quotes')
        .select('quote_text, author')
        .order('created_at', { ascending: true });

      const endTime = performance.now();
      console.log(`[Hero] Supabase fetch finished in ${endTime - startTime}ms`);
      if (error) {
        console.error("[Hero] Error fetching quote:", error.message);
      }

      let q: Quote | null = null;
      if (data && data.length > 0) {
        const dayIndex = Math.abs(new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0));
        const index = dayIndex % data.length;
        q = data[index];
        console.log(`[Hero] Quote of the day set: ${data[index]?.quote_text}`);
      } else {
        // Select a random fallback quote
        const dayIndex = Math.abs(new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0));
        const fallbackIndex = dayIndex % fallbackQuotes.length;
        q = fallbackQuotes[fallbackIndex];
        console.log(`[Hero] Fallback quote set: ${q.quote_text}`);
      }
      setQuote(q);
    };

    fetchDailyQuote();
  }, []);

  function handleNav(section: string) {
    if (section === "/shop") {
      if (!session) {
        navigate("/auth?redirect=shop");
      } else {
        navigate("/shop");
      }
      return;
    }
    if (section.startsWith("#")) {
      const element = document.getElementById(section.slice(1));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(section);
    }
  }

  return (
    <section id="home" className="hero-pattern min-h-screen flex flex-col items-center justify-center relative pt-24 sm:pt-28 md:pt-32 lg:pt-40">
      {/* Ztech Logo Top Left */}
      <img
        src="/ztech%20logo.jpg"
        alt="Ztech Logo"
        className="absolute top-2 left-2 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain z-40"
      />
      {/* Navigation Bar inside Hero */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <img
            src="/ztech%20logo.jpg"
            alt="Ztech Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
          />
          <div className="flex flex-col items-start gap-1">
            {/* RealtimeClock stays above name */}
            <div className="mb-1">
              <RealtimeClock />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-bold text-lg sm:text-xl text-white drop-shadow">Ztech Electronics Limited</span>
            </div>
          </div>
        </div>
        {/* Responsive Nav Links */}
        <div className="hidden md:flex gap-3 lg:gap-5">
          <button className="text-white hover:text-accent transition" onClick={() => handleNav("#home")}>Home</button>
          <button className="text-white hover:text-accent transition" onClick={() => handleNav("#services")}>Services</button>
          <button className="text-white hover:text-accent transition" onClick={() => handleNav("#team")}>Team</button>
          <button className="text-white hover:text-accent transition" onClick={() => handleNav("#contact")}>Contact</button>
          <button
            className="text-white font-semibold px-3 py-1 bg-accent rounded hover:bg-accent/80 transition"
            onClick={() => handleNav("/shop")}
          >
            Shop
          </button>
        </div>
        {/* Hamburger for mobile */}
        <div className="md:hidden">
          {/* You can add a hamburger menu here for mobile navigation */}
          <button className="text-white focus:outline-none" aria-label="Open menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      {/* Main Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-orbitron font-black text-white mb-4 sm:mb-6 leading-tight">
            Ztech Electronics Limited
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-orbitron text-accent mb-4 sm:mb-6 font-playfair">
            Where Service is Beyond the Obvious
          </h2>
          {quote && (
            <div className="mb-5 sm:mb-7">
              <blockquote className="text-base sm:text-xl italic text-gray-100 max-w-3xl mx-auto">
                "{quote.quote_text}"
              </blockquote>
              <span className="block mt-2 text-accent font-semibold">{quote.author || 'Unknown'}</span>
            </div>
          )}
          <p className="text-base sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Expert electronics repair, tech consultations, CCTV installations, and comprehensive
            computer solutions for homes and businesses.
          </p>
          <a
            href="/auth?view=signup"
            className="inline-block mt-4 px-6 sm:px-8 py-2.5 sm:py-3 bg-accent text-white font-bold text-base sm:text-lg rounded-lg shadow-lg hover:bg-accent/80 transition-all duration-200 animate-pulse"
            style={{ letterSpacing: '1px' }}
          >
            Get Started
          </a>
        </div>
        {/* Floating Tech Icons (unchanged) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 sm:w-6 sm:h-6 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 sm:w-4 sm:h-4 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
