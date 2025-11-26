'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import useSWR from 'swr';

const ROLES_API = '/api/roles';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SettingsPage() {
  const { data: initialRoles, error: fetchError, mutate } = useSWR<string[]>(ROLES_API, fetcher);

  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialRoles) {
      setRoles(initialRoles);
    }
  }, [initialRoles]);

  useEffect(() => {
    setIsDirty(JSON.stringify(roles) !== JSON.stringify(initialRoles));
  }, [roles, initialRoles]);

  const handleDeleteRole = (index: number) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await fetch(ROLES_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles }),
      });
      mutate(); // Re-fetch the data to confirm it's saved
    } catch (e) {
      setError('保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  if (fetchError) return <div className="p-6">役割の読み込みに失敗しました。</div>;
  if (!initialRoles) return <div className="p-6">役割を読み込み中...</div>;

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <header className="py-6">
          <h1 className="text-3xl font-bold text-text-primary">設定</h1>
        </header>

        <div className="bg-primary rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">役割の管理</h2>
          
          <div className="space-y-3 mb-6">
            {roles.map((role, index) => (
              <div key={index} className="flex justify-between items-center bg-secondary p-3 rounded-lg">
                <span className="text-text-primary">{role}</span>
                <button 
                  onClick={() => handleDeleteRole(index)}
                  className="text-text-secondary font-semibold text-sm hover:text-red-500"
                >
                  削除
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2 mb-6">
            <input 
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="新しい役割名"
              className="flex-grow px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button 
              onClick={handleAddRole}
              className="px-4 py-2 bg-secondary rounded-lg text-text-secondary font-semibold text-sm hover:bg-border transition-colors"
            >
              追加
            </button>
          </div>

          {error && <p className="text-text-secondary text-sm mb-4">{error}</p>}

          <div className="text-right">
            <button 
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="px-6 py-2 bg-accent rounded-lg text-white font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
