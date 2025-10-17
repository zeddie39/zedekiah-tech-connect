import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed bottom-6 right-6 z-50 p-3 rounded-full",
        "bg-accent text-white shadow-lg",
        "transform transition-all duration-300 ease-in-out",
        "hover:bg-accent/90 hover:shadow-xl",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        isHovered ? "scale-110" : "scale-100",
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className={cn(
        "w-6 h-6 transition-transform duration-300",
        isHovered ? "-translate-y-1" : "translate-y-0"
      )} />
    </button>
  );
}
