import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Confetti blast effect using absolute-positioned animated circles from the top
function ConfettiBlast() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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

export default function ConfirmedCelebration() {
  const [count, setCount] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const nextParam = new URLSearchParams(window.location.search).get("next");
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";


  useEffect(() => {
    // Check for error params in the URL hash or query
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    const errorCode = params.get('error') || params.get('error_code');
    const errorDesc = params.get('error_description');

    if (errorCode) {
      setError(errorDesc || 'Invalid or expired confirmation link.');
      return;
    }

    // Check active session email
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (!error && count === 0) {
      navigate(nextPath, { replace: true });
    }
    if (!error && count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count, navigate, error, nextPath]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-card to-background text-foreground relative overflow-hidden px-4">
      {/* Confetti blast effect from the top */}
      <ConfettiBlast />

      <div className="z-10 bg-card/90 backdrop-blur border border-amber-500/30 rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col items-center text-center max-w-lg w-full">
        {error ? (
          <>
            <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-red-400 mb-4 font-orbitron">
              Email Confirmation Failed
            </h1>
            <p className="text-sm sm:text-base text-foreground/80 mb-6 max-w-md leading-relaxed">
              {error}
            </p>
            <Link
              to="/auth"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-brand-on-orange font-bold text-base rounded-xl shadow-lg transition-all duration-200"
            >
              Return to Login
            </Link>
            <div className="text-muted-foreground text-xs mt-4">
              Need help? Please sign up again or contact support.
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center mb-6 animate-bounce shadow-xl shadow-amber-500/20">
              <CheckCheck className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Email Verified Successfully</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-3 font-orbitron">
              Welcome to Ztech Electronics!
            </h1>

            <p className="text-sm sm:text-base text-foreground/80 mb-6 leading-relaxed max-w-md">
              {userEmail ? (
                <>Your email address <strong className="text-amber-600 dark:text-amber-400 font-semibold">{userEmail}</strong> has been verified.</>
              ) : (
                <>Your account is now fully verified and activated.</>
              )}
              <br />You're ready to explore services, request repairs, and access your dashboard.
            </p>

            <Link
              to={nextPath}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-brand-on-orange font-extrabold text-lg rounded-xl shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] block mb-4"
            >
              Continue to Dashboard &rarr;
            </Link>

            <div className="text-muted-foreground text-xs font-medium">
              Automatically taking you to your dashboard in <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{count}</span>s...
            </div>
          </>
        )}
      </div>
    </div>
  );
}
