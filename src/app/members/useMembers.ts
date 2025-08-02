'use client';

import useSWR from 'swr';
import type { Member } from '../api/members/route';

const API_ENDPOINT = '/api/members';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch members');
  return res.json();
});

export function useMembers() {
  const { data: members, error, isLoading, mutate } = useSWR<Member[]>(API_ENDPOINT, fetcher);

  const performMutation = async (url: string, method: string, body?: any) => {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorBody.message || 'API request failed');
    }

    // ローカルのSWRキャッシュを即時更新し、その後サーバーから再取得
    mutate(); 
    return response.json().catch(() => null);
  };

  const addMember = async (member: Omit<Member, 'id'>) => {
    await performMutation(API_ENDPOINT, 'POST', member);
  };

  const updateMember = async (updatedMember: Member) => {
    await performMutation(`${API_ENDPOINT}/${updatedMember.id}`, 'PUT', updatedMember);
  };

  const deleteMember = async (id: string) => {
    await performMutation(`${API_ENDPOINT}/${id}`, 'DELETE');
  };

  return {
    members: members || [],
    isLoading,
    isError: error,
    addMember,
    updateMember,
    deleteMember,
  };
}
