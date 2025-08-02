
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import type { Member } from '../route'; // Member型を再利用

const MEMBERS_KEY = 'sacrament-members';

// メンバーを更新 (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const updatedMemberData = await request.json() as Partial<Omit<Member, 'id'>>;
    const members = await kv.get<Member[]>(MEMBERS_KEY) || [];

    let memberUpdated = false;
    const updatedMembers = members.map(member => {
      if (member.id === id) {
        memberUpdated = true;
        return { ...member, ...updatedMemberData };
      }
      return member;
    });

    if (!memberUpdated) {
      return new NextResponse('Member not found', { status: 404 });
    }

    await kv.set(MEMBERS_KEY, updatedMembers);
    return NextResponse.json(updatedMembers.find(m => m.id === id));

  } catch (error) {
    console.error(`Error updating member ${id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// メンバーを削除 (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const members = await kv.get<Member[]>(MEMBERS_KEY) || [];
    const filteredMembers = members.filter(member => member.id !== id);

    if (members.length === filteredMembers.length) {
      return new NextResponse('Member not found', { status: 404 });
    }

    await kv.set(MEMBERS_KEY, filteredMembers);
    return new NextResponse(null, { status: 204 }); // No Content

  } catch (error) {
    console.error(`Error deleting member ${id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
