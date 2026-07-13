import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ShopHeroCarousel() {
  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #160e2e 0%, #1a1040 50%, #160e2e 100%)' }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
          alt="Motherboard Circuit"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#160e2e] via-[#160e2e]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160e2e] via-transparent to-[#160e2e]/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff9800]/10 border border-[#ff9800]/20 text-[#ff9800] font-semibold text-xs mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase">Next-Gen Electronics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-[1.15]"
          >
            Upgrade Your{" "}
            <span className="text-[#ff9800]">Digital Lifestyle</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base max-w-lg leading-relaxed mb-6"
          >
            Experience the best in tech with Ztech. From high-performance motherboards to the latest smart gadgets, we provide quality you can trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="bg-[#ff9800] hover:bg-[#ff9800]/90 text-[#160e2e] font-bold shadow-lg shadow-[#ff9800]/20 hover:shadow-[#ff9800]/30 transition-all text-sm px-6"
              onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Collection
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border border-white/15 text-white hover:bg-white/5 hover:border-white/30 text-sm px-6"
              onClick={() => document.getElementById('shop-main')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
