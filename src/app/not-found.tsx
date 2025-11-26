import React from 'react';
import Link from 'next/link';
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">ページが見つかりません</h2>
      <p className="text-gray-600 mb-6">お探しのページは見つかりませんでした。</p>
      <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
        ホームに戻る
      </Link>
    </div>
  );
}