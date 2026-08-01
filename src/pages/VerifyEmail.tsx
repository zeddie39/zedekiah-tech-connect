import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read the email from location state (passed from Auth page after sign-up)
  const email = (location.state as { email?: string })?.email || "";

  useEffect(() => {
    // If no email was passed, redirect back to auth
    if (!email) {
      navigate("/auth?view=signup");
    }
  }, [email, navigate]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError(null);
    setResent(false);

    const redirectTo = `${window.location.origin}/ConfirmedCelebration`;
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (resendError) {
      setError(resendError.message);
    } else {
      setResent(true);
    }
    setResending(false);
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-500/10 via-card to-background text-foreground px-4">
      <div className="max-w-md w-full bg-card/90 backdrop-blur border border-amber-500/30 rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col items-center text-center">
        {/* Animated mail icon */}
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center mb-6 animate-bounce shadow-xl shadow-amber-500/20">
          <Mail className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 font-orbitron">
          Verify Your Email
        </h1>

        <p className="text-sm sm:text-base text-foreground/80 mb-2 leading-relaxed">
          We've sent a confirmation link to:
        </p>
        <p className="text-amber-600 dark:text-amber-400 font-semibold text-lg mb-6 break-all">
          {email}
        </p>

        <div className="w-full bg-muted/60 rounded-xl border border-border/50 p-4 mb-6 text-left">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-300 mb-2">📋 Next Steps:</h3>
          <ol className="text-xs sm:text-sm text-foreground/80 space-y-2 list-decimal pl-4">
            <li>Open your email inbox (check spam/promotions too)</li>
            <li>Click the <strong className="text-amber-600 dark:text-amber-400">confirmation link</strong> in the email</li>
            <li>You'll be redirected to your dashboard automatically</li>
          </ol>
        </div>

        {/* Resend button */}
        <Button
          onClick={handleResend}
          disabled={resending || resent}
          variant="outline"
          className="w-full mb-3 border-amber-500/40 text-amber-600 dark:text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 transition-all"
        >
          {resending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : resent ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Email Resent!
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Resend Confirmation Email
            </>
          )}
        </Button>

        {error && (
          <div className="text-red-400 text-sm mb-3">{error}</div>
        )}

        {/* Back to login */}
        <Link
          to="/auth"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-600 dark:text-amber-400 transition-colors mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <p className="text-muted-foreground text-xs mt-6">
          Didn't receive an email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
