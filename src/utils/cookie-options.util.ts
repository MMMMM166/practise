import { ICookieOptions } from '@auth/interfaces/interfaces';

export const getCookieOptions = (expires: Date): ICookieOptions => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
  expires,
});
