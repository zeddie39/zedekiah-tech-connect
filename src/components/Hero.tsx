
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';

type Quote = {
  quote_text: string;
  author?: string | null;
};

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

      if (data && data.length > 0) {
        const dayIndex = Math.abs(new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0));
        const index = dayIndex % data.length;
        setQuote(data[index]);
        console.log(`[Hero] Quote of the day set: ${data[index]?.quote_text}`);
      } else {
        setQuote({
          quote_text: "Empowering lives through technology.",
          author: "Zedekiah Team"
        });
        console.log("[Hero] No data, default quote set.");
      }
    };

    fetchDailyQuote();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200"
              onClick={scrollToContact}
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Services
            </Button>
          </div>
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
