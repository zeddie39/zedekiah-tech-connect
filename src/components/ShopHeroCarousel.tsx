import { Button } from "@/components/ui/button";
import { Cpu, Smartphone, Monitor, Zap, Sparkles, ArrowRight, Wifi, Battery, CircuitBoard } from "lucide-react";
import { motion } from "framer-motion";

const floatingIcons = [
  { Icon: Cpu, top: "15%", left: "75%", delay: "0s", duration: "8s", size: 28 },
  { Icon: Smartphone, top: "60%", left: "82%", delay: "1.5s", duration: "10s", size: 22 },
  { Icon: Monitor, top: "30%", left: "88%", delay: "3s", duration: "9s", size: 26 },
  { Icon: Wifi, top: "70%", left: "70%", delay: "2s", duration: "11s", size: 20 },
  { Icon: Battery, top: "20%", left: "65%", delay: "4s", duration: "7s", size: 18 },
  { Icon: CircuitBoard, top: "50%", left: "92%", delay: "0.5s", duration: "12s", size: 24 },
];

const features = [
  { Icon: Cpu, label: "Premium Components" },
  { Icon: Smartphone, label: "Latest Mobiles" },
  { Icon: Monitor, label: "Ultra Displays" },
  { Icon: Zap, label: "Fast Delivery" },
];

export default function ShopHeroCarousel() {
  return (
    <div className="relative overflow-hidden border-b border-accent/10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
          alt="Motherboard Circuit"
          className="w-full h-full object-cover scale-105"
        />
        {/* Multi-layer gradient overlays using brand primary */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-900/10" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Scan line effect */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(255,152,0,0.08) 50%)',
            backgroundSize: '100% 4px',
          }}
        />
      </div>

      {/* Glowing orb behind headline */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,152,0,0.08) 0%, transparent 70%)',
          animation: 'shop-pulse-glow 6s ease-in-out infinite',
        }}
      />

      {/* Floating tech icons */}
      {floatingIcons.map(({ Icon, top, left, delay, duration, size }, i) => (
        <div
          key={i}
          className="absolute z-[2] text-accent/20 pointer-events-none hidden md:block"
          style={{
            top,
            left,
            animation: `shop-drift ${duration} ease-in-out infinite`,
            animationDelay: delay,
          }}
        >
          <Icon size={size} />
        </div>
      ))}

      {/* Content — using framer-motion for staggered entrance */}
      <div className="relative z-10 px-6 sm:px-10 py-14 md:py-24 max-w-4xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-xs mb-5 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-wider uppercase">Next-Gen Electronics</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white mb-5 leading-[1.1]"
        >
          Upgrade Your <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-accent to-amber-500">
              Digital Lifestyle
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-accent/60 via-orange-500/80 to-accent/40 rounded-full blur-sm" />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-gray-300/90 text-sm md:text-lg max-w-xl leading-relaxed mb-9"
        >
          Experience the best in tech with Ztech. From high-performance motherboards to the latest smart gadgets,
          we provide quality you can trust and support that cares.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-primary font-bold shadow-lg shadow-accent/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-accent/40 text-base px-8"
            onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Collection
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 backdrop-blur-sm transition-all duration-300 text-base px-8"
            onClick={() => document.getElementById('shop-main')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Categories <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom Features Strip */}
      <div className="relative z-10 border-t border-white/[0.06] bg-primary/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-sm font-medium text-gray-300">
          {features.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all duration-300 group cursor-default"
            >
              <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <span className="group-hover:text-accent transition-colors">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
