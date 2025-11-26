'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { useMembers } from './useMembers';
import { Member } from './types';

const CORRECT_PASSWORD = '5475';
const PRIESTHOOD_OPTIONS: Member['priesthood'][] = ['メルキゼデク', '祭司', '教師', '執事'];

// --- Components ---

function MemberForm({ member, onSave, onCancel, isSaving }: { member: Partial<Member>, onSave: (member: Omit<Member, 'id'>) => void, onCancel: () => void, isSaving: boolean }) {
  const [name, setName] = useState(member.name || '');
  const [priesthood, setPriesthood] = useState(member.priesthood || '執事');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isSaving) return;
    onSave({ name, priesthood });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">名前</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary"
          required
          disabled={isSaving}
        />
      </div>
      <div>
        <label htmlFor="priesthood" className="block text-sm font-medium text-text-secondary mb-1">職</label>
        <select
          id="priesthood"
          value={priesthood}
          onChange={(e) => setPriesthood(e.target.value as Member['priesthood'])}
          className="block w-full px-3 py-2 border border-border bg-primary rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-secondary"
          disabled={isSaving}
        >
          {PRIESTHOOD_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSaving} className="px-4 py-2 bg-secondary rounded-lg text-text-secondary font-semibold text-sm hover:bg-border transition-colors disabled:opacity-50">キャンセル</button>
        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-accent rounded-lg text-white font-semibold text-sm hover:bg-accent/90 transition-colors disabled:opacity-50">
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-end sm:items-center z-50 p-4">
      <div className="bg-primary p-6 rounded-t-2xl sm:rounded-2xl shadow-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function MembersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const { members, isLoading, isError, addMember, updateMember, deleteMember } = useMembers();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('members-authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('members-authenticated', 'true');
      setAuthError('');
      setPassword('');
    } else {
      setAuthError('パスワードが正しくありません。');
    }
  };

  const handleApiAction = async (action: Promise<void>) => {
    setIsSaving(true);
    setActionError(null);
    try {
      await action;
      return true;
    } catch (error: any) {
      setActionError(error.message || '操作に失敗しました。');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNewMember = async (memberData: Omit<Member, 'id'>) => {
    if (await handleApiAction(addMember(memberData))) {
      setIsAddModalOpen(false);
    }
  };

  const handleSaveEditedMember = async (memberData: Omit<Member, 'id'>) => {
    if (editingMember && await handleApiAction(updateMember({ ...memberData, id: editingMember.id }))) {
      setEditingMember(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingMember && await handleApiAction(deleteMember(deletingMember.id))) {
      setDeletingMember(null);
    }
  };

  // --- Render Logic ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">メンバー管理</h2>
          <p className="text-text-secondary mb-6">このページにアクセスするにはパスワードが必要です。</p>
          <form onSubmit={handlePasswordSubmit} className="bg-primary p-6 rounded-xl shadow-sm">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg mb-4 text-center"
              placeholder="****"
            />
            {authError && <p className="text-text-secondary text-sm text-center mb-4">{authError}</p>}
            <button type="submit" className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors">認証</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-text-primary">メンバー管理</h1>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-accent rounded-lg text-white font-semibold text-sm hover:bg-accent/90 transition-colors">＋ 追加</button>
        </header>

        {isLoading && <p className="text-center text-text-secondary py-8">メンバー情報を読み込み中...</p>}
        {isError && <p className="text-center text-text-secondary py-8">エラー: メンバー情報の読み込みに失敗しました。</p>}
        {actionError && <p className="text-text-secondary bg-secondary p-3 rounded-lg mb-4">エラー: {actionError}</p>}

        <div className="space-y-3">
          {members.map(member => (
            <div key={member.id} className="bg-primary rounded-xl shadow-sm p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-text-primary">{member.name}</p>
                <p className="text-sm text-text-secondary">{member.priesthood}</p>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setEditingMember(member)} className="text-accent font-semibold text-sm hover:text-accent/90">編集</button>
                <button onClick={() => setDeletingMember(member)} className="text-text-secondary font-semibold text-sm hover:text-red-500">削除</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAddModalOpen && (
        <Modal onClose={() => !isSaving && setIsAddModalOpen(false)}>
          <h3 className="text-xl font-bold mb-6 text-center text-text-primary">新しいメンバーを追加</h3>
          <MemberForm onSave={handleSaveNewMember} onCancel={() => setIsAddModalOpen(false)} member={{}} isSaving={isSaving} />
        </Modal>
      )}

      {editingMember && (
        <Modal onClose={() => !isSaving && setEditingMember(null)}>
          <h3 className="text-xl font-bold mb-6 text-center text-text-primary">メンバーを編集</h3>
          <MemberForm member={editingMember} onSave={handleSaveEditedMember} onCancel={() => setEditingMember(null)} isSaving={isSaving} />
        </Modal>
      )}

      {deletingMember && (
        <Modal onClose={() => !isSaving && setDeletingMember(null)}>
          <h3 className="text-xl font-bold mb-4 text-center text-text-primary">メンバーを削除</h3>
          <p className="mb-6 text-center text-text-secondary">本当に <strong>{deletingMember.name}</strong> を削除しますか？</p>
          <div className="flex justify-center space-x-3">
            <button onClick={() => setDeletingMember(null)} disabled={isSaving} className="px-6 py-2 bg-secondary rounded-lg text-text-primary font-semibold hover:bg-border transition-colors disabled:opacity-50">キャンセル</button>
            <button onClick={handleDeleteConfirm} disabled={isSaving} className="px-6 py-2 bg-red-500 rounded-lg text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
              {isSaving ? '削除中...' : '削除'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
