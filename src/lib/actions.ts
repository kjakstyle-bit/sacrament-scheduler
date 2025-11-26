// src/lib/actions.ts

'use server';

import { prisma } from '@/lib/prisma';
import { Assignment } from '@prisma/client';

// スケジュール画面に必要なデータをすべて取得する関数
export async function fetchScheduleData() {
  try {
    // 割り当て情報（Assignment）を日付順に取得
    const assignments = await prisma.assignment.findMany({
      orderBy: {
        date: 'asc',
      },
      // 割り当てと同時に担当者情報（Profile）も取得
      include: {
        profile: true,
      },
    });

    // ユーザー情報（Profile）を名前順に取得
    const profiles = await prisma.profile.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return {
      assignments,
      profiles,
    };
  } catch (error) {
    console.error('Database Error:', error);
    // 画面側でエラーハンドリングできるように空のデータを返す
    return {
      assignments: [] as (Assignment & { profile: { id: string, name: string } })[],
      profiles: [] as { id: string, name: string }[],
    };
  }
}