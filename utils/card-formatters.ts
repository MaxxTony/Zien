/** Format raw digits as MM/YY (e.g. "1226" -> "12/26"). */
export function formatExpiryInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Format card number with space every 4 digits (e.g. 4242424242424242 -> 4242 4242 4242 4242). */
export function formatCardNumber(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/** Validate MM/YY: MM 01-12, YY >= current 2-digit year. Returns error message or null. */
export function validateExpiry(expiry: string): string | null {
  const digits = expiry.replace(/\D/g, '');
  if (digits.length !== 4) return 'Enter MM/YY (e.g. 12/26)';
  const mm = parseInt(digits.slice(0, 2), 10);
  const yy = parseInt(digits.slice(2, 4), 10);
  if (mm < 1 || mm > 12) return 'Month must be 01–12';
  const currentYear = new Date().getFullYear() % 100;
  if (yy < currentYear) return 'Card may be expired';
  return null;
}

/** Validate CVC: 3 or 4 digits. Returns error message or null. */
export function validateCvc(cvc: string): string | null {
  if (!/^\d{3,4}$/.test(cvc)) return 'Enter 3 or 4 digits';
  return null;
}
