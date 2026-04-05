import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;
const BASE_URL = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
const REDIRECT_URI = process.env.AUTH0_REDIRECT_URI || `${BASE_URL}/api/auth/callback`;
const POST_LOGOUT_REDIRECT = process.env.AUTH0_POST_LOGOUT_REDIRECT_URI || BASE_URL;
const AUDIENCE = process.env.AUTH0_AUDIENCE || '';

function createCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

function createCodeChallenge(codeVerifier: string): string {
  return createHash('sha256').update(codeVerifier).digest('base64url');
}

function authFailureRedirect(): URL {
  const redirectUrl = new URL(`${BASE_URL}/`);
  redirectUrl.searchParams.set('auth', 'failed');
  return redirectUrl;
}

function sanitizeReturnTo(input: string | null): string {
  if (!input) return '/dashboard';

  try {
    const decoded = decodeURIComponent(input);

    if (!decoded.startsWith('/') || decoded.startsWith('//')) {
      return '/dashboard';
    }

    return decoded;
  } catch {
    return '/dashboard';
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ auth0: string }> }
) {
  const { auth0: routeName } = await params;
  const url = new URL(request.url);

  if (routeName === 'login') {
    const returnTo = sanitizeReturnTo(url.searchParams.get('returnTo'));
    const codeVerifier = createCodeVerifier();
    const codeChallenge = createCodeChallenge(codeVerifier);
    const authUrl = new URL(`https://${AUTH0_DOMAIN}/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', 'openid profile email offline_access');
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    if (AUDIENCE) authUrl.searchParams.set('audience', AUDIENCE);
    authUrl.searchParams.set('state', returnTo);

    const response = NextResponse.redirect(authUrl.toString());
    response.cookies.set('pkce_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    });
    return response;
  }

  if (routeName === 'logout') {
    const logoutUrl = new URL(`https://${AUTH0_DOMAIN}/v2/logout`);
    logoutUrl.searchParams.set('client_id', CLIENT_ID);
    logoutUrl.searchParams.set('returnTo', POST_LOGOUT_REDIRECT);
    const response = NextResponse.redirect(logoutUrl.toString());
    response.cookies.set('appSession', '', { maxAge: 0, path: '/' });
    return response;
  }

  if (routeName === 'callback') {
    const code = url.searchParams.get('code');
    const state = sanitizeReturnTo(url.searchParams.get('state'));
    const error = url.searchParams.get('error');
    const errorDesc = url.searchParams.get('error_description');
    const codeVerifier = request.headers
      .get('cookie')
      ?.split('; ')
      .find((c) => c.startsWith('pkce_code_verifier='))
      ?.split('=')[1];
    
    if (error) {
      console.error('[Auth Callback] Auth0 Error:', error, errorDesc);
      return NextResponse.redirect(authFailureRedirect().toString());
    }

    if (!code) {
      return NextResponse.redirect(authFailureRedirect().toString());
    }

    if (!codeVerifier) {
      console.error('[Auth Callback] Missing PKCE code verifier cookie.');
      return NextResponse.redirect(authFailureRedirect().toString());
    }

    const returnTo = state;

    try {
      console.log('[Auth Callback] Exchanging code for token...');
      const tokenRes = await Promise.race([
        fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: decodeURIComponent(codeVerifier),
          }),
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Token exchange timeout after 10s')), 10000)
        ),
      ]);

      console.log('[Auth Callback] Token response received:', tokenRes.status);

      if (!tokenRes.ok) {
        const errorData = await tokenRes.json();
        console.error('[Auth Callback] Token endpoint error:', errorData);
        return NextResponse.redirect(authFailureRedirect().toString());
      }

      const tokens = await tokenRes.json();

      if (tokens.error) {
        console.error('[Auth Callback] Token error:', tokens.error, tokens.error_description);
        return NextResponse.redirect(authFailureRedirect().toString());
      }

      const userRes = await Promise.race([
        fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Userinfo fetch timeout after 10s')), 10000)
        ),
      ]);

      console.log('[Auth Callback] Userinfo response received:', userRes.status);

      if (!userRes.ok) {
        throw new Error('Failed to fetch user info');
      }

      const user = await userRes.json();

      const sessionData = JSON.stringify({
        user,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + (tokens.expires_in || 86400) * 1000,
      });
      const encoded = Buffer.from(sessionData).toString('base64');

      const response = NextResponse.redirect(`${BASE_URL}${returnTo}`);
      response.cookies.set('pkce_code_verifier', '', { maxAge: 0, path: '/' });
      response.cookies.set('appSession', encoded, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
      });
      return response;
    } catch (err) {
      console.error('[Auth Callback] Error:', err);
      return NextResponse.redirect(authFailureRedirect().toString());
    }
  }

  return NextResponse.json({ route: routeName, message: 'Auth route handler active' });
}
