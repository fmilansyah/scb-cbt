import { NextRequest, NextResponse } from 'next/server'
import { StorageConst } from './shared/constants/storage'

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  if (
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    pathname.startsWith('/auth') || // exclude static files
    pathname.includes('.') // exclude all files in the public folder
  ) {
    return NextResponse.next()
  }
  let loggedIn = request.cookies.get(StorageConst.UserKey)?.value
  if (loggedIn != null) {
    return NextResponse.next()
  }
  return NextResponse.redirect(`${origin}/auth/login`)
}
