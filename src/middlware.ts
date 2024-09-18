import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

 

// This function can be marked `async` if using `await` inside
export  async function middleware(request: NextRequest) {

    const token = await getToken({req : request});

    //path
    const url = request.nextUrl;
console.log( " path  : "  , url);
    //token ahe and url paths thne rediretion

    if(token && (
         url.pathname.startsWith("sign-in") ||
         url.pathname.startsWith("sign-up") || 
         url.pathname.startsWith("verify") || 
         url.pathname.startsWith("/")  
    ))
    { 
         
  return NextResponse.redirect(new URL('/home', request.url))

    }


    //token nhi

    if(!token && url.pathname.startsWith("/dashbord")){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }


}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    'sign-in',
    'sign-up',
    '/',
    '/dashbord/:path*',
    'verify/:path*',
  ]
}