import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Member } from '../../../members/useMembers';

// 特定のメンバーを取得 (GET)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return new NextResponse('Member not found', { status: 404 });
    }

    const member: Member = {
      id: profile.id,
      name: profile.name,
      priesthood: (profile.priesthood as Member['priesthood']) || '執事',
    };

    return NextResponse.json(member);
  } catch (error) {
    console.error(`Error fetching member ${params.id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 特定のメンバーを更新 (PUT)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedMember = await request.json() as Member;

    const profile = await prisma.profile.update({
      where: { id: params.id },
      data: {
        name: updatedMember.name,
        priesthood: updatedMember.priesthood,
      },
    });

    const member: Member = {
      id: profile.id,
      name: profile.name,
      priesthood: (profile.priesthood as Member['priesthood']) || '執事',
    };

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error(`Error updating member ${params.id}:`, error);
    // Prismaのエラーコードで分岐も可能だが、簡略化
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 特定のメンバーを削除 (DELETE)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.profile.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting member ${params.id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}