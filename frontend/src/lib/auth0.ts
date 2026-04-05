import { cookies } from 'next/headers';

interface Session {
  user: {
    sub: string;
    name: string;
    email: string;
    picture?: string;
  };
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('appSession');
  
  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session: Session = JSON.parse(decoded);
    
    // Check if expired
    if (session.expiresAt < Date.now()) {
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
};

export const getAccessToken = async (): Promise<string> => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error('No access token found in session');
  }
  return session.accessToken;
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  const session = await getSession();
  return session?.refreshToken;
};

export const getUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};
