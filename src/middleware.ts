import { authMiddleware } from "@civic/auth-web3/nextjs/middleware"

export default authMiddleware();

export const config = {
  // include the paths you wish to secure here
  matcher: [
    /*
    * Match all request paths except:
    * - _next directory (Next.js static files)
    * - favicon.ico, sitemap.xml, robots.txt
    * - image files
    * - pages/dashboard (protected route)
    * - wallet (now also excluded from protection)
    */
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\.jpg|.*\\.png|.*\\.svg|.*\\.gif|pages/dashboard|wallet|codeblock.PNG|auditor.PNG|builder.PNG|Testor.PNG|auditor.PNG|builder.PNG).*)',
  ],
}