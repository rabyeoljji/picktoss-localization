/**
 * Generates a cryptographically secure random string for use as a nonce.
 * @param length - The length of the nonce string. Default is 16.
 * @param encoding - The encoding format: 'hex' | 'base64'. Default is 'hex'.
 * @returns A random string of specified length and encoding
 */
export function generateNonce(length = 16, encoding: 'hex' | 'base64' = 'hex'): string {
  const randomBytes = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(randomBytes);
  
  if (encoding === 'hex') {
    return Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  } else {
    return btoa(String.fromCharCode(...randomBytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  }
}

/**
 * Generate a simple nonce for use in non-critical applications.
 * This is faster but less secure than generateNonce.
 * @param length - The length of the nonce string. Default is 16.
 * @returns A random string of specified length
 */
export function generateSimpleNonce(length = 16): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  
  return result;
}