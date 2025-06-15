
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/dashboard");
    });
    return () => listener?.subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError("Both fields are required");
      setLoading(false);
      return;
    }
    if (view === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const redirectTo = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="max-w-sm w-full mx-2 p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {view === "login" ? "Sign In" : "Register"}
        </h1>
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {view === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {view === "login" ? (
            <>
              New here?{" "}
              <button className="underline text-blue-700" onClick={() => setView("signup")}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="underline text-blue-700" onClick={() => setView("login")}>
                Sign In
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
