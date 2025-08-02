
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// 週ごとの割り当ての型
export type WeeklyAssignments = {
  [weekKey: string]: { // 例: "2024-08-04"
    [role: string]: string | null; // 例: { "祝福パン": "member-id-123" }
  };
};

const ASSIGNMENTS_KEY = 'sacrament-assignments';

// 全ての割り当てを取得 (GET)
export async function GET() {
  try {
    const assignments = await kv.get<WeeklyAssignments>(ASSIGNMENTS_KEY);
    return NextResponse.json(assignments || {});
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 特定の週の割り当てを更新 (POST)
export async function POST(request: Request) {
  try {
    const { weekKey, assignmentsForWeek } = await request.json() as { weekKey: string, assignmentsForWeek: { [role: string]: string | null } };
    
    if (!weekKey || assignmentsForWeek === undefined) {
      return new NextResponse('Bad Request: Missing weekKey or assignmentsForWeek', { status: 400 });
    }

    const allAssignments = await kv.get<WeeklyAssignments>(ASSIGNMENTS_KEY) || {};
    
    const updatedAssignments: WeeklyAssignments = {
      ...allAssignments,
      [weekKey]: assignmentsForWeek,
    };

    await kv.set(ASSIGNMENTS_KEY, updatedAssignments);
    return NextResponse.json(updatedAssignments, { status: 200 });

  } catch (error) {
    console.error('Error updating assignments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
