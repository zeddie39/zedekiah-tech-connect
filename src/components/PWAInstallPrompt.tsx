import React, { useEffect, useState } from "react";

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#1e293b] border-2 border-[#2563eb] shadow-xl rounded-xl p-5 z-50 flex items-center gap-4 animate-fade-in">
      <span className="text-primary font-semibold text-base mr-2">Install Ztech Electronics App?</span>
      <button
        className="bg-[#2563eb] text-white px-5 py-2 rounded-lg font-bold shadow hover:bg-[#1d4ed8] transition-all duration-150"
        onClick={handleInstallClick}
      >
        Install
      </button>
      <button
        className="ml-2 text-[#94a3b8] hover:text-[#2563eb] font-semibold px-3 py-2 rounded transition-all duration-150"
        onClick={() => setShowPrompt(false)}
      >
        Dismiss
      </button>
    </div>
  );
};

export default PWAInstallPrompt;
