import 'server-only';
import { cookies } from 'next/headers';

const AUTH_TOKEN_COOKIE =
  process.env.VENDURE_AUTH_TOKEN_COOKIE || 'vendure-auth-token';

const TOKEN_COOKIE = 
 process.env.TOKEN_COOKIE || 'vd-jt-io'

export async function getAuthToken() {
  return (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;
}

export async function setAuthToken(token: string) {
  (await cookies()).set(AUTH_TOKEN_COOKIE, token);
}

export async function setJWT(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token);
}

export async function removeAuthToken() {
  (await cookies()).delete(AUTH_TOKEN_COOKIE);
}
