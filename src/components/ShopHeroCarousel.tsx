import { Button } from "@/components/ui/button";
import { Cpu, Smartphone, Monitor, Zap, Sparkles, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function ShopHeroCarousel() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10 py-12 md:py-20 lg:py-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-wider uppercase">Premium Electronics</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-5 leading-[1.1]">
              Your One-Stop{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                Tech Store
              </span>
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mb-8 mx-auto lg:mx-0">
              Discover premium gadgets, laptops, audio gear, and more. Buy and sell electronics
              with confidence on Kenya's trusted tech marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button
                size="lg"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] hover:shadow-2xl font-semibold text-base h-12 px-8"
                onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-border hover:bg-muted/50 font-semibold text-base h-12 px-8"
                onClick={() => document.getElementById('shop-main')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Sell Your Gear
              </Button>
            </div>
          </motion.div>

          {/* Right - Feature image / stats */}
          <motion.div
            className="flex-1 max-w-lg w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-60" />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
                  alt="Electronics Tech"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: ShieldCheck, label: "Verified Sellers", value: "100+" },
                      { icon: Truck, label: "Fast Delivery", value: "Nationwide" },
                      { icon: Zap, label: "Listed Products", value: "500+" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center bg-background/80 backdrop-blur-md rounded-xl p-3 border border-border/40">
                        <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                        <div className="text-sm font-bold text-foreground">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-border/40 bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> Premium Components
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" /> Latest Mobiles
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" /> Ultra Displays
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Secure Payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
