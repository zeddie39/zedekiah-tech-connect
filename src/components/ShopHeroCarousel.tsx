import { Button } from "@/components/ui/button";
import { Cpu, Smartphone, Monitor, Zap, Sparkles, ArrowRight } from "lucide-react";

export default function ShopHeroCarousel() {
  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden border border-accent/20 shadow-2xl group">
      {/* Background Image - Motherboard/Tech Theme */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
          alt="Motherboard Circuit"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Decorative Circuit Lines Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 py-12 md:py-20 max-w-4xl">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-medium text-xs mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide uppercase">Next-Gen Electronics</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-4 leading-tight">
            Upgrade Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Digital Lifestyle</span>
          </h1>

          <p className="text-muted-foreground text-sm md:text-lg max-w-xl leading-relaxed mb-8">
            Experience the best in tech with Ztech. From high-performance motherboards to the latest smart gadgets,
            we provide quality you can trust and support that cares.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
              onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-accent/50 text-foreground hover:bg-accent/10 backdrop-blur-sm"
              onClick={() => document.getElementById('shop-main')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Features Strip */}
      <div className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-md px-6 py-4">
        <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent" /> Premium Components
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-accent" /> Latest Mobiles
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-accent" /> Ultra Displays
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" /> Fast Delivery
          </div>
        </div>
      </div>
    </div>
  );
}
