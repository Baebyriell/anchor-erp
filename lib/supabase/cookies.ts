// Session cookies are only ever read on the server, so hide them from
// browser JavaScript (blocks theft via XSS) and only send them over HTTPS.
export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
