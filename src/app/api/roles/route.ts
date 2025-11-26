
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const ROLES_KEY = 'sacrament-roles';
const defaultRoles = ['祝福パン', '祝福水', 'パス1', 'パス2', 'パス3', 'パス4'];

// Get all roles
export async function GET() {
  try {
    let roles = await kv.get<string[]>(ROLES_KEY);
    if (!roles || roles.length === 0) {
      // Initialize with default roles if none are set
      await kv.set(ROLES_KEY, defaultRoles);
      roles = defaultRoles;
    }
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Update all roles
export async function POST(request: Request) {
  try {
    const { roles } = await request.json() as { roles: string[] };
    
    if (!roles) {
      return new NextResponse('Bad Request: Missing roles', { status: 400 });
    }

    await kv.set(ROLES_KEY, roles);
    return NextResponse.json(roles, { status: 200 });

  } catch (error) {
    console.error('Error updating roles:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
