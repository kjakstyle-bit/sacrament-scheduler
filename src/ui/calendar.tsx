// src/ui/calendar.tsx

import React from 'react';
import { Assignment } from '@prisma/client';
import { format, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

// --- 型定義 ---

// page.tsxから渡されるProfileの型
type Profile = {
  id: string;
  name: string;
}

// Assignment型にProfile情報が付いた結合型（AssignmentWithProfile）
type AssignmentWithProfile = Assignment & {
  profile: Profile;
}

// CalendarコンポーネントのProps
type CalendarProps = {
  assignments: AssignmentWithProfile[];
  profiles: Profile[];
  roles: string[];
};

// --- ヘルパー関数 ---

// 日付と役割に基づいて割り当てをフィルタリングする
const getAssignment = (
  assignments: AssignmentWithProfile[],
  date: Date,
  role: string
) => {
  return assignments.find(a =>
    isSameDay(a.date, date) && a.role === role
  );
};

// --- カレンダーコンポーネント本体 ---

export function Calendar({ assignments, profiles, roles }: CalendarProps) {
  // 現在の月の1日を取得
  const today = new Date();
  const start = startOfMonth(today);

  // 今月のすべての日付の配列を生成
  const daysInMonth = eachDayOfInterval({
    start: start,
    end: new Date(today.getFullYear(), today.getMonth() + 1, 0), // 今月の最終日
  });

  return (
    <div className="overflow-x-auto shadow-lg rounded-xl bg-white border border-gray-200">
      {/* テーブル本体 */}
      <table className="min-w-full divide-y divide-gray-200">

        {/* ヘッダー (日付) */}
        <thead>
          <tr className="bg-gray-50">
            {/* 左端の役割名カラム */}
            <th className="sticky left-0 bg-gray-100 z-10 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
              役割
            </th>
            {/* 今月の日付カラム */}
            {daysInMonth.map((date) => (
              <th
                key={format(date, 'yyyy-MM-dd')}
                className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r border-gray-200 ${isSameDay(date, today) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}
              >
                {/* 曜日 */}
                <div className="text-[10px] font-normal">
                  {format(date, 'EEE', { locale: ja })}
                </div>
                {/* 日付 */}
                <div className="text-sm font-bold">
                  {format(date, 'd')}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ボディ (役割と割り当て) */}
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => (
            <tr key={role} className="hover:bg-gray-50">
              {/* 役割名 */}
              <td className="sticky left-0 bg-white z-10 px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 w-40">
                {role}
              </td>

              {/* 割り当てセル */}
              {daysInMonth.map((date) => {
                // その日付、その役割の割り当てデータを探す
                const assignment = getAssignment(assignments, date, role);

                return (
                  <td
                    key={format(date, 'yyyy-MM-dd')}
                    className="px-4 py-2 whitespace-nowrap text-center text-sm border-r border-gray-100 cursor-pointer hover:bg-indigo-50 transition-colors"
                  >
                    {/* 割り当てられたメンバー名を表示 */}
                    {assignment ? (
                      <span className="text-gray-800 font-semibold">
                        {assignment.profile.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}