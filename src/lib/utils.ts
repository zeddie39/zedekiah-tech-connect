import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Create a WhatsApp chat link with an optional pre-filled message.
 * Returns null if the phone number cannot be normalized to a sensible format.
 */
export function formatPhoneForWhatsapp(input?: string | null, message?: string, productImageUrl?: string) {
  if (!input) return null;
  // remove all non-digit characters
  const digits = input.replace(/\D/g, '');
  if (!digits) return null;
  // basic sanity: must be at least 9 digits (local) and at most 15 (E.164)
  if (digits.length < 9 || digits.length > 15) return null;

  const isMobile = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const baseUrl = isMobile 
    ? `https://wa.me/${digits}` 
    : `https://web.whatsapp.com/send?phone=${digits}`;

  let fullMessage = message ? message.trim() : "";
  if (productImageUrl) {
    fullMessage += (fullMessage ? "\n\n" : "") + "Product Image: " + productImageUrl;
  }

  if (fullMessage) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}text=${encodeURIComponent(fullMessage)}`;
  }
  
  return baseUrl;
}
