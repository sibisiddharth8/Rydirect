/**
 * Generates a random 6-digit string of numbers.
 * @returns {string} A 6-digit OTP.
 */
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};