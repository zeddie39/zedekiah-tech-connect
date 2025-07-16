import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Confetti blast effect using absolute-positioned animated circles from the top
function ConfettiBlast() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {[...Array(60)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = Math.random() * 1.5 + 1.5;
        const size = Math.random() * 16 + 8;
        const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        return (
          <div
            key={i}
            className="rounded-full opacity-80 animate-confetti-blast"
            style={{
              position: 'absolute',
              top: 0,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// Add confetti blast animation to tailwind
// In your tailwind.config.js, add:
// extend: { keyframes: { 'confetti-blast': { '0%': { transform: 'translateY(0)' }, '100%': { transform: 'translateY(100vh)' } } }, animation: { 'confetti-blast': 'confetti-blast 1.5s linear forwards' } }

export default function ConfirmedCelebration() {
  const [count, setCount] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for error params in the URL
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    const errorCode = params.get('error') || params.get('error_code');
    const errorDesc = params.get('error_description');
    if (errorCode) {
      setError(errorDesc || 'Invalid or expired confirmation link.');
    }
    if (!error && count === 0) {
      navigate("/auth");
    }
    if (!error) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count, navigate, error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-accent/10 via-primary/10 to-white relative overflow-hidden">
      {/* Confetti blast effect from the top */}
      <ConfettiBlast />
      <div className="z-10 bg-white/90 rounded-xl shadow-xl p-10 flex flex-col items-center">
        {error ? (
          <>
            <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4 animate-bounce">Email Confirmation Failed</h1>
            <p className="text-lg text-gray-700 mb-6 text-center max-w-md">{error}</p>
            <a
              href="/auth"
              className="px-8 py-3 bg-accent text-white font-bold text-lg rounded-lg shadow-lg hover:bg-accent/80 transition-all duration-200 animate-pulse mb-2"
            >
              Go to Login
            </a>
            <div className="text-gray-500 text-sm mt-2">
              If you need a new confirmation email, please try signing up again or contact support.
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 animate-bounce">🎉 Email Confirmed! 🎉</h1>
            <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
              Your email has been successfully confirmed.<br/>
              You can now log in to your account and start exploring our services!
            </p>
            <a
              href="/auth"
              className="px-8 py-3 bg-accent text-white font-bold text-lg rounded-lg shadow-lg hover:bg-accent/80 transition-all duration-200 animate-pulse mb-2"
            >
              Continue to Login
            </a>
            <div className="text-gray-500 text-sm mt-2">
              Redirecting in <span className="font-bold text-primary">{count}</span> seconds...<br/>
              or <a href="/auth" className="underline text-accent font-semibold">click here to sign in</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
