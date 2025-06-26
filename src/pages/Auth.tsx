import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [view, setView] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signupNotice, setSignupNotice] = useState<string | null>(null);
  const [resetView, setResetView] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const params = new URLSearchParams(location.search);
        if (params.get("redirect") === "shop") {
          navigate("/shop");
        } else {
          navigate("/dashboard");
        }
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const params = new URLSearchParams(location.search);
        if (params.get("redirect") === "shop") {
          navigate("/shop");
        } else {
          navigate("/dashboard");
        }
      }
    });
    // If user lands with ?view=signup, show signup form
    if (location.search.includes("view=signup")) {
      setView("signup");
    }
    return () => listener?.subscription.unsubscribe();
  }, [navigate, location.search]);

  useEffect(() => {
    // Show notice if redirected from Hero "Shop"
    if (location.search.includes("redirect=shop")) {
      setSignupNotice("You must log in or sign up to access the Shop.");
    }
  }, [location.search]);

  // Detect reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Support both ?view=reset&access_token=... and ?type=recovery&access_token=...
    if ((params.get("view") === "reset" || params.get("type") === "recovery") && params.get("access_token")) {
      setResetView(false); // Hide email form
      setResetToken(params.get("access_token"));
    }
  }, [location.search]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignupNotice(null);
    if (!email || !password) {
      setError("Both fields are required");
      setLoading(false);
      return;
    }
    if (view === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const redirectTo = `${window.location.origin}/ConfirmedCelebration`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) setError(error.message);
      else setSignupNotice("Check your email to confirm registration before logging in!");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetNotice(null);
    if (!resetEmail) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth?view=reset` // or a custom reset page
    });
    if (error) setError(error.message);
    else setResetNotice("Check your email for a password reset link.");
    setLoading(false);
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetNotice(null);
    if (!newPassword || !resetToken) {
      setError("Please enter a new password.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setError(error.message);
    else {
      setResetSuccess(true);
      setResetNotice("Password updated! Redirecting to login...");
      setTimeout(() => {
        navigate("/auth");
      }, 2500); // Redirect after 2.5 seconds
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted relative">
      <Card className="max-w-sm w-full mx-2 p-8">
        {resetToken ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center text-primary">Set a New Password</h1>
            <p className="text-gray-600 text-center mb-4 text-sm">
              Enter a strong new password for your account and confirm it below.<br/>
              After updating, you can log in immediately.
            </p>
            {resetSuccess ? (
              <div className="mb-3 py-2 px-3 rounded bg-green-100 text-green-800 text-center text-sm">
                <span className="font-semibold">Password updated!</span><br/>
                <a href="/auth" className="underline text-accent font-semibold">Sign in</a> with your new password.
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-3">
                <Input
                  placeholder="New password (min 6 characters)"
                  type="password"
                  value={newPassword}
                  autoFocus
                  minLength={6}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Input
                  placeholder="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  minLength={6}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-accent text-white font-semibold" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Update Password
                </Button>
              </form>
            )}
          </>
        ) : resetView ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center text-primary">Reset Your Password</h1>
            <p className="text-gray-600 text-center mb-4 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            {resetNotice && (
              <div className="mb-3 py-2 px-3 rounded bg-green-100 text-green-800 text-center text-sm">{resetNotice}</div>
            )}
            <form onSubmit={handleResetPassword} className="space-y-3">
              <Input
                placeholder="Email address"
                value={resetEmail}
                autoComplete="username"
                autoFocus
                onChange={e => setResetEmail(e.target.value)}
                required
                disabled={loading}
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-accent text-white font-semibold" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Send Reset Link
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <button className="underline text-accent font-semibold" onClick={() => {
                setResetView(false);
                setError(null);
                setResetNotice(null);
              }}>
                ← Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">
              {view === "login" ? "Sign In" : "Register"}
            </h1>
            {signupNotice && (
              <div className="mb-3 py-2 px-3 rounded bg-yellow-100 text-yellow-800 text-center text-sm">{signupNotice}</div>
            )}
            <form onSubmit={handleAuth} className="space-y-3">
              <Input
                placeholder="Email"
                value={email}
                autoComplete="username"
                autoFocus
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                autoComplete={view === "signup" ? "new-password" : "current-password"}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              {/* Terms and Privacy checkbox for signup */}
              {view === "signup" && (
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    id="accept-terms"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <label htmlFor="accept-terms" className="select-none">
                    I agree to the
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-primary mx-1">Terms & Conditions</a>
                    and
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary mx-1">Privacy Policy</a>.
                  </label>
                </div>
              )}
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading || (view === "signup" && !acceptedTerms)}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {view === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {view === "login" ? (
                <>
                  New here?{" "}
                  <button className="underline text-blue-700" onClick={() => {
                    setView("signup");
                    setError(null);
                    setSignupNotice(null);
                  }}>
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button className="underline text-blue-700" onClick={() => {
                    setView("login");
                    setError(null);
                    setSignupNotice(null);
                  }}>
                    Sign In
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              <button className="underline text-blue-700" onClick={() => {
                setResetView(true);
                setError(null);
                setSignupNotice(null);
              }}>
                Forgot password?
              </button>
            </div>
          </>
        )}
        <div className="mt-4 text-center">
          <button
            className="inline-block bg-accent text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-accent/80 transition-all text-base"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </Card>
    </div>
  );
}
