import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled 200px
      setIsVisible(window.pageYOffset > 200);
    };

    // Initial check
    toggleVisibility();
    
    // Add scroll event listener with passive flag for better performance
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label="Scroll to top"
      className={cn(
        // Base styles
        "fixed bottom-6 right-6 z-50",
        "p-3 rounded-full",
        "bg-accent text-white",
        "shadow-lg",
        
        // Animations
        "transition-all duration-300 ease-out",
        "transform hover:scale-110 active:scale-95",
        
        // Hover effects
        "hover:bg-accent/90 hover:shadow-xl",
        
        // Focus styles
        "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2",
        
        // Mobile optimizations
        "touch-manipulation",
        "sm:p-4",
        
        // Visibility animation
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0 pointer-events-none"
      )}
    >
      <ArrowUpIcon 
        className={cn(
          "w-5 h-5 sm:w-6 sm:h-6",
          "transition-transform duration-300",
          isHovered ? "-translate-y-1" : "translate-y-0"
        )}
        strokeWidth={2.5}
      />
      
      {/* Accessibility: Screen reader text */}
      <span className="sr-only">Scroll to top of page</span>
    </button>
  );
}