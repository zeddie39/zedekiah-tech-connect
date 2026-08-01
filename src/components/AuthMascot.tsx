import { motion, AnimatePresence } from "framer-motion";
import watching from "@/assets/auth-mascot-watching.png";
import covering from "@/assets/auth-mascot-covering.png";

interface AuthMascotProps {
  isPasswordFocused: boolean;
  isEmailFocused: boolean;
  emailLength?: number;
}

/**
 * 3D mascot that leans on top of the auth card.
 * - Watches (and tilts toward the caret) while the email field is active
 * - Covers her eyes with one hand while the password field is active
 */
export default function AuthMascot({
  isPasswordFocused,
  isEmailFocused,
  emailLength = 0,
}: AuthMascotProps) {
  const hidden = isPasswordFocused;
  // Gentle head tilt/slide as the user types their email
  const tilt = isEmailFocused ? Math.min(Math.max((emailLength - 8) * 0.4, -5), 5) : 0;

  return (
    <div className="relative mx-auto -mt-28 -mb-1 h-32 w-full max-w-[260px] select-none pointer-events-none">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={hidden ? "covering" : "watching"}
          src={hidden ? covering : watching}
          alt={hidden ? "Mascot covering her eyes while you type your password" : "Mascot watching you sign in"}
          width={1024}
          height={768}
          loading="lazy"
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: isEmailFocused ? -2 : 0,
            scale: 1,
            rotate: tilt,
          }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="absolute bottom-0 left-[46%] w-full -translate-x-1/2 object-contain drop-shadow-[0_18px_28px_hsl(var(--foreground)/0.25)]"
        />
      </AnimatePresence>
    </div>
  );
}
