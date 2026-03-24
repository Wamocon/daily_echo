import { type NextRequest, NextResponse } from 'next/server';

// Supabase Auth ist deferred — Passthrough bis Supabase eingerichtet ist
export async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
