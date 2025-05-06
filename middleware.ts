import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    console.log('Middleware is running...');

  const url = request.nextUrl;
  const currency = url.searchParams.get('currency');

  // default (usd)
  if (!currency) {
    url.searchParams.set('currency', 'usd');
    return NextResponse.redirect(url); 
  }

  return NextResponse.next();
}