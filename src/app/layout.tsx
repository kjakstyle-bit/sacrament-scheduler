'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="ja">
      <body className="bg-gray-50 font-sans">
        <div className="container mx-auto max-w-md">
          <header className="p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">聖餐担当表</h1>
          </header>

          <main className="p-4">
            {children}
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
            <nav className="flex justify-around items-center max-w-md mx-auto">
              <Link href="/" className={`flex flex-col items-center py-2 px-4 ${pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`}>
                <CalendarIcon className="w-6 h-6" />
                <span className="text-xs font-medium">スケジュール</span>
              </Link>
              <Link href="/members" className={`flex flex-col items-center py-2 px-4 ${pathname === '/members' ? 'text-blue-600' : 'text-gray-500'}`}>
                <UserGroupIcon className="w-6 h-6" />
                <span className="text-xs font-medium">メンバー</span>
              </Link>
              <Link href="/settings" className={`flex flex-col items-center py-2 px-4 ${pathname === '/settings' ? 'text-blue-600' : 'text-gray-500'}`}>
                <CogIcon className="w-6 h-6" />
                <span className="text-xs font-medium">設定</span>
              </Link>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}