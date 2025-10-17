import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { cn } from "@/lib/utils";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeVisible = window.scrollY > 200;
      setVisible(shouldBeVisible);
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => scrollToTop()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-50 p-3",
        "rounded-full bg-accent text-white",
        "shadow-lg hover:shadow-xl",
        "transform transition-all duration-300 ease-out",
        "hover:bg-accent/90 hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        "active:scale-95",
        visible 
          ? "translate-y-0 opacity-100" 
          : "translate-y-16 opacity-0 pointer-events-none"
      )}
      aria-label="Scroll to top of page"
      title="Scroll to top"
    >
      <ArrowUpIcon 
        className={cn(
          "w-6 h-6 transition-transform duration-300",
          isHovered ? "-translate-y-1" : "translate-y-0"
        )}
      />
      <span className="sr-only">Scroll to top of page</span>
    </button>
  );
}