export const randomString = (length: number, chars: string): string => {
  let mask = '';
  if (chars.indexOf('a') > -1) { mask += 'abcdefghijklmnopqrstuvwxyz'; }
  if (chars.indexOf('A') > -1) { mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
  if (chars.indexOf('#') > -1) { mask += '0123456789'; }
  if (chars.indexOf('!') > -1) { mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'; }
  let result = '';
  for (let i = length; i > 0; --i) { result += mask[Math.floor(Math.random() * mask.length)]; }
  return result;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
