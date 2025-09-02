import { NextResponse } from 'next/server';

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'https://iedc-treasure-hunt-backend.onrender.com'
).replace(/\/+$/, '');

export async function GET() {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }
    const res = await fetch(`${BACKEND_URL}/admin/teams`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}


