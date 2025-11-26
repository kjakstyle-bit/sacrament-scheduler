
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// { [memberId: string]: string[] } (weekKeys)
const UNAVAILABILITY_KEY = 'sacrament-unavailability';

// Get all unavailability data for a specific week
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekKey = searchParams.get('weekKey');

  if (!weekKey) {
    return new NextResponse('Bad Request: Missing weekKey', { status: 400 });
  }

  try {
    const unavailability = await kv.get<{ [memberId: string]: string[] }>(UNAVAILABILITY_KEY) || {};
    const unavailableMemberIds = Object.entries(unavailability)
      .filter(([_, weekKeys]) => weekKeys.includes(weekKey))
      .map(([memberId]) => memberId);

    return NextResponse.json(unavailableMemberIds);
  } catch (error) {
    console.error('Error fetching unavailability:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Add or remove an unavailability record
export async function POST(request: Request) {
  try {
    const { memberId, weekKey, isUnavailable } = await request.json() as { memberId: string, weekKey: string, isUnavailable: boolean };

    if (!memberId || !weekKey || isUnavailable === undefined) {
      return new NextResponse('Bad Request: Missing parameters', { status: 400 });
    }

    const unavailability = await kv.get<{ [memberId: string]: string[] }>(UNAVAILABILITY_KEY) || {};

    const memberUnavailability = unavailability[memberId] || [];

    if (isUnavailable) {
      // Add the weekKey if it's not already there
      if (!memberUnavailability.includes(weekKey)) {
        unavailability[memberId] = [...memberUnavailability, weekKey];
      }
    } else {
      // Remove the weekKey
      unavailability[memberId] = memberUnavailability.filter(wk => wk !== weekKey);
      if (unavailability[memberId].length === 0) {
        delete unavailability[memberId];
      }
    }

    await kv.set(UNAVAILABILITY_KEY, unavailability);
    return NextResponse.json(unavailability, { status: 200 });

  } catch (error) {
    console.error('Error updating unavailability:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
