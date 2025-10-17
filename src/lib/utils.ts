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

  let url = `https://wa.me/${digits}`;
  
  if (message) {
    const formattedMessage = message.trim();
    if (productImageUrl) {
      // Add image link in the message
      url += `?text=${encodeURIComponent(formattedMessage + "\n\nProduct Image: " + productImageUrl)}`;
    } else {
      url += `?text=${encodeURIComponent(formattedMessage)}`;
    }
  }
  
  return url;
}
