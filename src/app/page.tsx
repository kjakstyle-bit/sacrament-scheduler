'use client';

import { useState, useEffect } from 'react';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import useSWR, { mutate } from 'swr';
import { useMembers, Member } from './members/useMembers';
import type { WeeklyAssignments } from './api/assignments/route';

const sacramentRoles = ['祝福パン', '祝福水', 'パス1', 'パス2', 'パス3', 'パス4'];
const ASSIGNMENTS_API = '/api/assignments';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { members, isLoading: membersLoading } = useMembers();
  const { data: weeklyAssignments, error: assignmentsError, isLoading: assignmentsLoading } = useSWR<WeeklyAssignments>(ASSIGNMENTS_API, fetcher);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState<{ [key: string]: string | null }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const weekKey = format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');

  useEffect(() => {
    if (weeklyAssignments) {
      const currentWeekAssignments = weeklyAssignments[weekKey] || sacramentRoles.reduce((acc, role) => ({ ...acc, [role]: null }), {});
      setAssignments(currentWeekAssignments);
    }
  }, [currentDate, weeklyAssignments, weekKey]);

  const updateAssignmentsForWeek = async (newAssignments: { [key: string]: string | null }) => {
    try {
      await fetch(ASSIGNMENTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekKey, assignmentsForWeek: newAssignments }),
      });
      mutate(ASSIGNMENTS_API);
    } catch (e) {
      console.error("Failed to save assignments", e);
    }
  };

  const assignMember = (memberId: string) => {
    if (selectedRole) {
      const newAssignments = { ...assignments, [selectedRole]: memberId };
      updateAssignmentsForWeek(newAssignments);
      closeModal();
    }
  };

  const openModal = (role: string) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const getAvailableMembersForRole = (role: string | null): Member[] => {
    if (!role || !members) return [];
    const assignedMemberIds = Object.values(assignments).filter(id => id !== assignments[role]).filter(Boolean) as string[];
    const available = members.filter(m => !assignedMemberIds.includes(m.id));

    if (role === '祝福パン' || role === '祝福水') {
      return available.filter(m => m.priesthood === 'メルキゼデク' || m.priesthood === '祭司');
    }
    return available;
  };

  const availableMembers = getAvailableMembersForRole(selectedRole);

  if (membersLoading || assignmentsLoading) {
    return <div className="text-center p-8">データを読み込んでいます...</div>;
  }

  return (
    <div className="bg-gray-50 pb-20">
      <section className="p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">{format(currentDate, 'M月d日', { locale: ja })}</h2>
        <div className="flex justify-between space-x-2">
          <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="flex-1 py-2 px-4 bg-gray-200/80 rounded-lg text-gray-800 font-semibold text-sm">前週</button>
          <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="flex-1 py-2 px-4 bg-blue-500 rounded-lg text-white font-semibold text-sm">次週</button>
        </div>
      </section>

      <section className="mt-4 bg-white rounded-lg shadow-sm">
        <ul className="divide-y divide-gray-100">
          {sacramentRoles.map((role) => {
            const assignedMemberId = assignments[role];
            const foundMember = members.find((m) => m.id === assignedMemberId);

            return (
              <li key={role} className="flex justify-between items-center p-4">
                <span className="text-base text-gray-900">{role}</span>
                <button onClick={() => openModal(role)} className="flex items-center">
                  <span className={`text-base ${foundMember ? 'text-gray-800' : 'text-gray-400'}`}>
                    {foundMember ? foundMember.name : '未選択'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-end z-50">
          <div className="bg-white p-4 rounded-t-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-center">{selectedRole} を選択</h3>
            <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {availableMembers.length > 0 ? (
                availableMembers.map((member) => (
                  <li key={member.id} className="py-3">
                    <button onClick={() => assignMember(member.id)} className="w-full text-left text-blue-600 text-base">
                      {member.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="py-3 text-center text-gray-500">選択可能なメンバーがいません</li>
              )}
            </ul>
            <button onClick={closeModal} className="mt-4 w-full py-3 px-4 bg-gray-200/80 rounded-lg text-gray-800 font-semibold">キャンセル</button>
          </div>
        </div>
      )}
    </div>
  );
}
