'use client';

import React from 'react';

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
      <body className="pb-20">

        <main>
          {children}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-primary/80 backdrop-blur-sm border-t border-border">
          <nav className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/" className={`flex flex-col items-center py-2 px-4 ${pathname === '/' ? 'text-accent' : 'text-text-secondary'}`}>
              <CalendarIcon className="w-4 h-4 !w-4 !h-4" width={16} height={16} />
              <span className="text-xs font-medium">スケジュール</span>
            </Link>
            <Link href="/members" className={`flex flex-col items-center py-2 px-4 ${pathname === '/members' ? 'text-accent' : 'text-text-secondary'}`}>
              <UserGroupIcon className="w-4 h-4 !w-4 !h-4" width={16} height={16} />
              <span className="text-xs font-medium">メンバー</span>
            </Link>
            <Link href="/settings" className={`flex flex-col items-center py-2 px-4 ${pathname === '/settings' ? 'text-accent' : 'text-text-secondary'}`}>
              <CogIcon className="w-4 h-4 !w-4 !h-4" width={16} height={16} />
              <span className="text-xs font-medium">設定</span>
            </Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}