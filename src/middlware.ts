import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';



export async function middleware(request: NextRequest) {

  const token = await getToken({ req: request });
  const url = request.nextUrl;

  console.log("middlwaer call");
  console.log(token , url);
  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashbord', request.url));
  }

  if (!token && url.pathname.startsWith('/dashbord')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashbord/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};