import 'server-only';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { auth } from '@clerk/nextjs/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const AUTH_TOKEN_COOKIE =
  process.env.VENDURE_AUTH_TOKEN_COOKIE || 'vendure-auth-token';

const TOKEN_COOKIE =
  process.env.TOKEN_COOKIE || 'vd-jt-io'

export async function getAuthToken() {
  return (await cookies()).get(AUTH_TOKEN_COOKIE)?.value;
}

export function setAuthTokenOnCookies(
  cookiesStore: ReadonlyRequestCookies,
  token: string
) {
  return cookiesStore.set(AUTH_TOKEN_COOKIE, token)
}

export function getAuthTokenFromCookies(
  cookiesStore: ReadonlyRequestCookies
) {

  return cookiesStore.get(AUTH_TOKEN_COOKIE)?.value;
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

export async function removeJWT() {
  (await cookies()).delete(TOKEN_COOKIE);
}

export async function clearVendureAuth() {
  await removeAuthToken();
  await removeJWT();
}

export async function requireClerkAuth() {
  const { userId } = await auth();
  if (userId) return;

  const headersList = await headers();
  const returnTo = headersList.get('referer') || process.env.NEXT_PUBLIC_SITE_URL!;

  const signInUrl = new URL(process.env.CLERK_SIGN_IN_URL!);
  signInUrl.searchParams.set('redirect_url', returnTo);

  redirect(signInUrl.toString());
}