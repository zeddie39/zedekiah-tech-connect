import { Button } from "@/components/ui/button";
import { Cpu, Smartphone, Monitor, Zap, Sparkles } from "lucide-react";

export default function ShopHeroCarousel() {
  return (
    <div className="relative mb-10 rounded-xl overflow-hidden border border-accent/30">
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Electronics background"
        >
          {/* Multiple sources as fallbacks */}
          <source src="https://cdn.coverr.co/videos/coverr-futuristic-circuit-6432/1080p.mp4" type="video/mp4" />
          <source src="https://cdn.coverr.co/videos/coverr-circuit-board-6136/1080p.mp4" type="video/mp4" />
        </video>
        {/* Primary gradient overlay per brand colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
      </div>

      {/* Blue-tinted overlays to enhance the video look */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle radial glow using primary hue */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,14,46,0.25),transparent_65%)]" />
        {/* Soft scanlines tinted with accent/primary */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(120deg,rgba(255,152,0,0.25)_1px,transparent_1px),linear-gradient(60deg,rgba(22,14,46,0.35)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 md:px-10 py-10 md:py-16 text-white">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-semibold text-xs mb-3 shadow">
            <Sparkles className="w-4 h-4" /> Meet your smart electronics buddy
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-sm">
            Welcome to Ztech — Friendly, Reliable, and Ready to Help
          </h2>
          <p className="mt-2 md:mt-3 text-primary-foreground/90 text-sm md:text-base max-w-2xl">
            From phones and laptops to accessories and repairs, we’re here to guide you to the right tech.
            Explore quality products with trusted support.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              className="bg-accent text-primary hover:bg-accent/90"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              className="border-accent/60 text-accent hover:bg-accent/10"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Explore Categories
            </Button>
            <div className="text-[11px] md:text-xs text-primary-foreground/80">
              Curated gadgets <span className="mx-1">•</span> Fast support <span className="mx-1">•</span> Fair prices
            </div>
          </div>
        </div>
      </div>

      {/* Foreground decorative chips */}
      <div className="relative z-10 px-4 sm:px-6 md:px-10 pb-6 text-primary-foreground/90">
        <div className="flex items-center gap-3 flex-wrap opacity-95">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-primary/60 border border-accent/30 rounded-full px-3 py-1 shadow-sm">
            <Cpu className="w-4 h-4 text-accent" /> Smart Chips
          </div>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-primary/60 border border-accent/30 rounded-full px-3 py-1 shadow-sm">
            <Smartphone className="w-4 h-4 text-accent" /> Phones
          </div>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-primary/60 border border-accent/30 rounded-full px-3 py-1 shadow-sm">
            <Monitor className="w-4 h-4 text-accent" /> Laptops
          </div>
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-primary/60 border border-accent/30 rounded-full px-3 py-1 shadow-sm">
            <Zap className="w-4 h-4 text-accent" /> Accessories
          </div>
        </div>
      </div>
    </div>
  );
}
