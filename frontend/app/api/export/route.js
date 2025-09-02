import { NextResponse } from 'next/server';

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '').replace(/\/+$/, '');

export async function GET() {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }
    const res = await fetch(`${BACKEND_URL}/admin/export`);
    const blob = await res.blob();
    return new NextResponse(blob, {
      status: res.status,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="registrations.xlsx"'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}


