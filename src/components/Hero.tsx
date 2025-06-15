
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  return (
    <section id="home" className="hero-pattern min-h-screen flex items-center justify-center relative pt-24 md:pt-32 lg:pt-40">
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 leading-tight">
            Zedekiah Tech Electronics Ltd
            <span className="text-accent block">Professional Tech Solutions</span>
          </h1>
          {quote && (
            <div className="mb-7">
              <blockquote className="text-xl italic text-gray-100 max-w-3xl mx-auto">
                “{quote.quote_text}”
              </blockquote>
              <span className="block mt-2 text-accent font-semibold">{quote.author || 'Unknown'}</span>
            </div>
          )}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Expert electronics repair, tech consultations, CCTV installations, and comprehensive 
            computer solutions for homes and businesses.
          </p>
          {/* Removed all action buttons (Get Started Today, View Services) */}
        </div>
        {/* Floating Tech Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-10 h-10 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
