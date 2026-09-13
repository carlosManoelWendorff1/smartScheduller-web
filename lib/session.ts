import { cookies } from "next/headers";

const SESSION_COOKIE = "ss_session";
const USER_COOKIE = "ss_user";

export interface SessionUser {
  userId: string;
  tenantId: string;
  name: string;
  role: string;
}
/**
 * Two cookies on purpose: ss_session holds the JWT and is httpOnly (client
 * JS can never read it - the whole point of the BFF pattern). ss_user holds
 * non-secret info (role/tenantId, not the token itself) so Server Components
 * can render nav/UI without needing to decode the JWT in Next.js at all.
 */
export async function setSession(token: string, user: SessionUser) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // matches app.jwt.ttl-minutes default (480min) on the backend
  });
  store.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(USER_COOKIE);
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
