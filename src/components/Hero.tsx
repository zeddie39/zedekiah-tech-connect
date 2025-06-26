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
    author: "Ztech Electronics Ltd Team"
  },
  {
    quote_text: "Innovation in electronics powers the future.",
    author: "Ztech Electronics Ltd Team"
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
    <section id="home" className="hero-pattern min-h-[60vh] flex flex-col items-center justify-center relative pt-24 pb-4 sm:pt-32 sm:pb-12 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20">
      {/* Removed Ztech Logo from Hero section */}
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
