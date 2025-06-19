import React, { useEffect, useState } from "react";

const COOKIE_KEY = "ztech_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[99999] bg-primary text-white px-4 py-4 flex flex-col md:flex-row items-center justify-between shadow-lg animate-fade-in">
      <div className="mb-2 md:mb-0 text-sm md:text-base">
        This website uses cookies to enhance your experience, provide secure authentication, and analyze site usage. By continuing, you agree to our <a href="/privacy" className="underline text-accent">Privacy Policy</a>.
      </div>
      <button
        onClick={acceptCookies}
        className="mt-2 md:mt-0 bg-accent text-white font-semibold rounded px-6 py-2 ml-0 md:ml-4 hover:bg-accent/90 transition-all"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsent;
