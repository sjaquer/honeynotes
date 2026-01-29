/**
 * Partner Code Generation and Validation
 * Used to link two accounts as a couple
 */

// Generate a random 6-character code
export function generatePartnerCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars: I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Format code for display (XXX-XXX)
export function formatPartnerCode(code: string): string {
  if (code.length !== 6) return code;
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

// Clean code input (remove dashes and spaces, uppercase)
export function cleanPartnerCode(input: string): string {
  return input.replace(/[-\s]/g, '').toUpperCase();
}

// Validate code format
export function isValidPartnerCode(code: string): boolean {
  const cleaned = cleanPartnerCode(code);
  return /^[A-Z0-9]{6}$/.test(cleaned);
}
