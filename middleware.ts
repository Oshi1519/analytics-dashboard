import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/track(.*)'
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Agar logged in hai aur landing page pe hai → dashboard bhejo
  if (userId && request.nextUrl.pathname === '/') {
    return Response.redirect(new URL('/dashboard', request.url))
  }

  // Agar logged out hai aur protected page pe hai → sign-in bhejo
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}