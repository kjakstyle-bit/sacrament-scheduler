'use client';

import { useState, useEffect } from 'react';
import { useMembers, Member } from './useMembers';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">名前</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isSaving}
        />
      </div>
      <div>
        <label htmlFor="priesthood" className="block text-sm font-medium text-gray-700">職</label>
        <select
          id="priesthood"
          value={priesthood}
          onChange={(e) => setPriesthood(e.target.value as Member['priesthood'])}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isSaving}
        >
          {PRIESTHOOD_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} disabled={isSaving} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50">キャンセル</button>
        <button type="submit" disabled={isSaving} className="py-2 px-4 bg-blue-500 text-white rounded-lg disabled:opacity-50">
          {isSaving ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="relative">
          <button onClick={onClose} className="absolute -top-4 -right-4 text-gray-500 hover:text-gray-800">✕</button>
          {children}
        </div>
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
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold text-center mb-4">パスワードを入力</h2>
          <p className="text-sm text-gray-600 text-center mb-6">このページにアクセスするにはパスワードが必要です。</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-center"
              placeholder="****"
            />
            {authError && <p className="text-red-500 text-sm text-center mb-4">{authError}</p>}
            <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg">認証</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">メンバー管理</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="py-2 px-4 bg-blue-500 text-white rounded-lg">＋ 追加</button>
      </div>

      {isLoading && <p>メンバー情報を読み込み中...</p>}
      {isError && <p className="text-red-500">エラー: メンバー情報の読み込みに失敗しました。</p>}
      {actionError && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-4">エラー: {actionError}</p>}

      <div className="bg-white rounded-lg shadow-sm">
        <ul className="divide-y divide-gray-100">
          {members.map(member => (
            <li key={member.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">{member.priesthood}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingMember(member)} className="text-blue-600">編集</button>
                <button onClick={() => setDeletingMember(member)} className="text-red-600">削除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isAddModalOpen && (
        <Modal onClose={() => !isSaving && setIsAddModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-4">新しいメンバーを追加</h3>
          <MemberForm onSave={handleSaveNewMember} onCancel={() => setIsAddModalOpen(false)} member={{}} isSaving={isSaving} />
        </Modal>
      )}

      {editingMember && (
        <Modal onClose={() => !isSaving && setEditingMember(null)}>
          <h3 className="text-lg font-semibold mb-4">メンバーを編集</h3>
          <MemberForm member={editingMember} onSave={handleSaveEditedMember} onCancel={() => setEditingMember(null)} isSaving={isSaving} />
        </Modal>
      )}

      {deletingMember && (
        <Modal onClose={() => !isSaving && setDeletingMember(null)}>
          <h3 className="text-lg font-semibold mb-4">メンバーを削除</h3>
          <p className="mb-4">本当に <strong>{deletingMember.name}</strong> を削除しますか？</p>
          <div className="flex justify-end space-x-2">
            <button onClick={() => setDeletingMember(null)} disabled={isSaving} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50">キャンセル</button>
            <button onClick={handleDeleteConfirm} disabled={isSaving} className="py-2 px-4 bg-red-500 text-white rounded-lg disabled:opacity-50">
              {isSaving ? '削除中...' : '削除'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
