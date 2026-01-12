import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/account/(.*)',
  '/checkout/(.*)',
  '/account/profile/(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect()
  }

  return intlMiddleware(req)  
}, {
  authorizedParties: ["https://ecommer.shop/", "https://clerk.ecommer.shop/", "http://localhost:3000", "http://localhost:3001"]
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
  ],
}