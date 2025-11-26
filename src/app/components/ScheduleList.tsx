'use client';

import React from 'react';
import { Member } from '../members/useMembers';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface ScheduleListProps {
  sacramentRoles: string[];
  assignments: { [key: string]: string | null };
  members: Member[];
  openModal: (role: string) => void;
}

export default function ScheduleList({ sacramentRoles, assignments, members, openModal }: ScheduleListProps) {
  return (
    <section className="bg-primary rounded-xl shadow-sm overflow-hidden mb-4">
      <ul className="divide-y divide-border">
        {sacramentRoles.map((role) => {
          const assignedMemberId = assignments[role];
          const foundMember = members.find((m) => m.id === assignedMemberId);

          return (
            <li key={role} className="px-4 py-4">
              <button
                className="w-full flex items-center justify-between"
                type="button"
                onClick={() => openModal(role)}
              >
                <span className="text-text-primary">{role}</span>
                <span className="flex items-center gap-2 text-text-secondary">
                  <span>{foundMember ? foundMember.name : '未選択'}</span>
                  <ChevronRightIcon className="h-5 w-5 text-text-secondary/50" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}