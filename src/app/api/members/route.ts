import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Member } from '../../members/useMembers';

// メンバー一覧を取得 (GET)
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { name: 'asc' },
    });

    const members: Member[] = profiles.map(p => ({
      id: p.id,
      name: p.name,
      priesthood: (p.priesthood as Member['priesthood']) || '執事', // デフォルト値
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// メンバーを新規追加 (POST)
export async function POST(request: Request) {
  try {
    const newMember = await request.json() as Omit<Member, 'id'>;

    const createdProfile = await prisma.profile.create({
      data: {
        name: newMember.name,
        priesthood: newMember.priesthood,
      },
    });

    const memberToAdd: Member = {
      id: createdProfile.id,
      name: createdProfile.name,
      priesthood: (createdProfile.priesthood as Member['priesthood']) || '執事',
    };

    return NextResponse.json(memberToAdd, { status: 201 });
  } catch (error: any) {
    console.error('Error adding member:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return new NextResponse(JSON.stringify({ error: error.message, details: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
