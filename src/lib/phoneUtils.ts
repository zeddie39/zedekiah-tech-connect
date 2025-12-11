/**
 * Phone number utilities for M-Pesa integration
 * Handles Kenyan phone number validation and formatting
 */

// Valid Safaricom prefixes (07XX and 01XX series)
const SAFARICOM_PREFIXES = [
    '0700', '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709',
    '0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719',
    '0720', '0721', '0722', '0723', '0724', '0725', '0726', '0727', '0728', '0729',
    '0790', '0791', '0792', '0793', '0794', '0795', '0796', '0797', '0798', '0799',
    '0110', '0111', '0112', '0113', '0114', '0115',
];

export interface PhoneValidationResult {
    isValid: boolean;
    formatted: string;
    error?: string;
}

/**
 * Validates and formats a Kenyan phone number for M-Pesa
 * @param phone - Phone number in various formats (0712345678, +254712345678, 254712345678)
 * @returns Validation result with formatted number (254XXXXXXXXX format)
 */
export function validateAndFormatPhone(phone: string): PhoneValidationResult {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Handle different input formats
    if (cleaned.startsWith('254')) {
        // Already in international format (254XXXXXXXXX)
        cleaned = '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('0')) {
        // Local format (0XXXXXXXXX) - keep as is
    } else if (cleaned.length === 9) {
        // Without leading zero (7XXXXXXXX)
        cleaned = '0' + cleaned;
    }

    // Validate length
    if (cleaned.length !== 10) {
        return {
            isValid: false,
            formatted: '',
            error: 'Phone number must be 10 digits (e.g., 0712345678)',
        };
    }

    // Check if it starts with a valid Safaricom prefix
    const prefix = cleaned.slice(0, 4);
    const isSafaricom = SAFARICOM_PREFIXES.some(p => cleaned.startsWith(p.slice(0, 3)));

    if (!isSafaricom) {
        return {
            isValid: false,
            formatted: '',
            error: 'Please enter a valid Safaricom number (07XX or 01XX)',
        };
    }

    // Format to international format for M-Pesa API
    const formatted = '254' + cleaned.slice(1);

    return {
        isValid: true,
        formatted,
    };
}

/**
 * Formats phone number for display (0712 345 678)
 */
export function formatPhoneForDisplay(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('254') && cleaned.length === 12) {
        const local = '0' + cleaned.slice(3);
        return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
    }

    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }

    return phone;
}
