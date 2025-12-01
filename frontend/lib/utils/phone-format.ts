/**
 * Formats a phone number as user types
 * Supports India format: +91 98765 43210
 * Also supports other international formats
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, '');
  
  // If it starts with +, handle international format
  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1);
    
    // Special handling for India (+91)
    if (digits.startsWith('91')) {
      const indiaDigits = digits.slice(2); // Remove country code
      if (indiaDigits.length === 0) return '+91';
      if (indiaDigits.length <= 5) return `+91 ${indiaDigits}`;
      // Format: +91 98765 43210 (5 digits space 5 digits)
      return `+91 ${indiaDigits.slice(0, 5)} ${indiaDigits.slice(5, 10)}`;
    }
    
    // Handle other international formats
    if (digits.length <= 1) return cleaned;
    if (digits.length <= 4) return `+${digits}`;
    if (digits.length <= 7) return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 10) return `+${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
    return `+${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
  }
  
  // Handle regular phone number (assume India if starts with 9 or 8)
  const digits = cleaned.replace(/\D/g, '');
  
  // If starts with 91, treat as India country code
  if (digits.startsWith('91') && digits.length >= 12) {
    const indiaDigits = digits.slice(2);
    if (indiaDigits.length <= 5) return `+91 ${indiaDigits}`;
    return `+91 ${indiaDigits.slice(0, 5)} ${indiaDigits.slice(5, 10)}`;
  }
  
  // If starts with 9 or 8 (India mobile prefix), format as Indian number
  if (digits.length === 10 && (digits.startsWith('9') || digits.startsWith('8') || digits.startsWith('7'))) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  
  // Default formatting
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}

/**
 * Validates phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Check if it's a valid phone number (10-15 digits, optionally starting with +)
  return /^(\+?\d{10,15})$/.test(cleaned);
}

