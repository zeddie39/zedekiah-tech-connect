import { useState, useEffect } from "react";
import { cn, formatPhoneForWhatsapp } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const businessWhatsApp = "+254757756763"; // Ztech's default business number

  useEffect(() => {
    // Show the button after a slight delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Show the "Need help?" tooltip occasionally
    const tooltipTimer = setInterval(() => {
      setIsTooltipVisible(true);
      setTimeout(() => setIsTooltipVisible(false), 5000); // Hide after 5 seconds
    }, 30000); // Show every 30 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  const handleClick = () => {
    const url = formatPhoneForWhatsapp(businessWhatsApp, "Hi Ztech! I'm reaching out from your website and need some assistance.");
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div 
        className={cn(
          "bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 transition-all duration-500 origin-bottom-right",
          isTooltipVisible ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="text-sm font-medium">
          Need help? <br />
          <span className="text-xs text-gray-500 font-normal">Chat with us! 👋</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsTooltipVisible(false);
          }}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
        {/* Chat bubble tail */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45" />
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsTooltipVisible(true)}
        className="group relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="28" 
          height="28" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  );
}
