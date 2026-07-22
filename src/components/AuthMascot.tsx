import React from "react";
import { motion } from "framer-motion";

interface AuthMascotProps {
  isPasswordFocused: boolean;
  isEmailFocused: boolean;
  emailLength?: number;
}

export default function AuthMascot({
  isPasswordFocused,
  isEmailFocused,
  emailLength = 0,
}: AuthMascotProps) {
  // Calculate eye pupil shift based on email typing length (-6 to +6 px shift)
  const pupilShiftX = Math.min(Math.max((emailLength - 10) * 0.5, -6), 6);
  const pupilShiftY = isEmailFocused ? 2 : 0;

  return (
    <div className="flex flex-col items-center justify-center -mb-2 z-10 select-none">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md overflow-visible"
      >
        {/* Mascot Ears */}
        <motion.circle
          cx="28"
          cy="32"
          r="16"
          className="fill-primary/80"
          animate={{
            scale: isPasswordFocused ? [1, 0.9, 1] : 1,
            rotate: isPasswordFocused ? -10 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <circle cx="28" cy="32" r="9" className="fill-accent/40" />

        <motion.circle
          cx="92"
          cy="32"
          r="16"
          className="fill-primary/80"
          animate={{
            scale: isPasswordFocused ? [1, 0.9, 1] : 1,
            rotate: isPasswordFocused ? 10 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
        <circle cx="92" cy="32" r="9" className="fill-accent/40" />

        {/* Mascot Main Head Body */}
        <circle cx="60" cy="60" r="42" className="fill-primary" />

        {/* Mascot Face Inner Contour */}
        <ellipse cx="60" cy="66" rx="34" ry="28" className="fill-card" />

        {/* Cute Cheeks */}
        <circle cx="36" cy="72" r="7" className="fill-pink-400/40" />
        <circle cx="84" cy="72" r="7" className="fill-pink-400/40" />

        {/* Nose */}
        <polygon points="56,64 64,64 60,68" className="fill-primary/90" />

        {/* Mouth */}
        <motion.path
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          className="stroke-primary"
          animate={{
            d: isPasswordFocused
              ? "M 52 74 Q 60 72 68 74"
              : isEmailFocused
              ? "M 50 72 Q 60 80 70 72"
              : "M 52 73 Q 60 78 68 73",
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Eyes Group (Left and Right Eyes) */}
        <g id="mascot-eyes">
          {/* Left Eye Socket */}
          <circle cx="44" cy="54" r="10" className="fill-background stroke-primary/20" strokeWidth="1" />
          {/* Left Pupil */}
          <motion.circle
            cx="44"
            cy="54"
            r={isEmailFocused ? 5.5 : 4.5}
            className="fill-primary"
            animate={{
              cx: 44 + pupilShiftX,
              cy: 54 + pupilShiftY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          {/* Left Pupil Shine */}
          <motion.circle
            cx="42"
            cy="52"
            r="1.8"
            className="fill-white"
            animate={{
              cx: 42 + pupilShiftX,
              cy: 52 + pupilShiftY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Right Eye Socket */}
          <circle cx="76" cy="54" r="10" className="fill-background stroke-primary/20" strokeWidth="1" />
          {/* Right Pupil */}
          <motion.circle
            cx="76"
            cy="54"
            r={isEmailFocused ? 5.5 : 4.5}
            className="fill-primary"
            animate={{
              cx: 76 + pupilShiftX,
              cy: 54 + pupilShiftY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          {/* Right Pupil Shine */}
          <motion.circle
            cx="74"
            cy="52"
            r="1.8"
            className="fill-white"
            animate={{
              cx: 74 + pupilShiftX,
              cy: 52 + pupilShiftY,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </g>

        {/* Animated Paws/Hands - Covers Eyes on Password Focus */}
        {/* Left Paw */}
        <motion.g
          animate={
            isPasswordFocused
              ? { x: 12, y: -26, rotate: 15 }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          <circle cx="28" cy="98" r="14" className="fill-primary stroke-background" strokeWidth="2" />
          <circle cx="24" cy="94" r="3.5" className="fill-accent/40" />
          <circle cx="31" cy="92" r="3" className="fill-accent/40" />
        </motion.g>

        {/* Right Paw */}
        <motion.g
          animate={
            isPasswordFocused
              ? { x: -12, y: -26, rotate: -15 }
              : { x: 0, y: 0, rotate: 0 }
          }
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
        >
          <circle cx="92" cy="98" r="14" className="fill-primary stroke-background" strokeWidth="2" />
          <circle cx="96" cy="94" r="3.5" className="fill-accent/40" />
          <circle cx="89" cy="92" r="3" className="fill-accent/40" />
        </motion.g>
      </svg>
    </div>
  );
}
