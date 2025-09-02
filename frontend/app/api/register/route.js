import { NextResponse } from 'next/server';

// Resolve backend URL safely for both dev and prod
const rawBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

// Normalize (remove trailing slashes) to avoid double slashes when concatenating paths
const BACKEND_URL = rawBackendUrl ? rawBackendUrl.replace(/\/+$/, '') : '';

export async function POST(request) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        {
          error:
            'Backend URL is not configured. Set NEXT_PUBLIC_BACKEND_URL in your frontend service.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Normalize members to an array of non-empty strings as backend expects
    let members = body?.members;
    if (Array.isArray(members)) {
      members = members
        .map((m) => {
          if (typeof m === 'string') return m.trim();
          if (m && typeof m === 'object' && typeof m.name === 'string') return m.name.trim();
          return '';
        })
        .filter((name) => name && name.length > 0);
    } else {
      members = [];
    }

    const payload = {
      teamName: typeof body?.teamName === 'string' ? body.teamName.trim() : body?.teamName,
      password: body?.password,
      members,
    };

    const res = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Attempt to parse JSON; handle non-JSON responses gracefully
    let data;
    try {
      data = await res.json();
    } catch (_) {
      data = { error: 'Unexpected response from server' };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || 'Registration failed' },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
