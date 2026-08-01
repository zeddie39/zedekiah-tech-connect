import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Supabase email-confirmation links sometimes land on the Site URL (usually "/")
 * instead of the emailRedirectTo target. When we detect confirmation tokens in
 * the URL, forward the user to the celebration page so they always see the
 * confetti screen before entering the app.
 */
export default function AuthRedirectGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("confirmedcelebration") || path.includes("confirmed-celebration")) return;

    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const hasTokens =
      /access_token=|type=signup|type=email_change|type=recovery|error_code=/.test(hash) ||
      /(^|[?&])(token_hash|type)=(signup|email_change|recovery)/.test(search) ||
      /error_code=/.test(search);

    if (hasTokens) {
      navigate(`/ConfirmedCelebration${search}${hash}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}
