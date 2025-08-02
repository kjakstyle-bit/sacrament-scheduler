
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export type Member = {
  id: string;
  name: string;
  priesthood: 'メルキゼデク' | '祭司' | '教師' | '執事';
};

const MEMBERS_KEY = 'sacrament-members';

// メンバー一覧を取得 (GET)
export async function GET() {
  try {
    const members = await kv.get<Member[]>(MEMBERS_KEY);
    // もしデータがなければ空配列を返す
    return NextResponse.json(members || []);
  } catch (error) {
    console.error('Error fetching members:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// メンバーを新規追加 (POST)
export async function POST(request: Request) {
  try {
    const newMember = await request.json() as Omit<Member, 'id'>;
    const members = await kv.get<Member[]>(MEMBERS_KEY) || [];
    
    const memberToAdd: Member = {
      ...newMember,
      id: crypto.randomUUID(),
    };

    await kv.set(MEMBERS_KEY, [...members, memberToAdd]);
    return NextResponse.json(memberToAdd, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
