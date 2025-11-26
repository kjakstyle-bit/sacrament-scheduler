'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';

export function FooterNavigation() {
    const pathname = usePathname();

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border z-50">
            <nav className="flex justify-around items-center max-w-md mx-auto pb-safe">
                <Link href="/" className={`flex flex-col items-center py-3 px-4 transition-colors ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <CalendarIcon className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">スケジュール</span>
                </Link>
                <Link href="/members" className={`flex flex-col items-center py-3 px-4 transition-colors ${pathname === '/members' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <UserGroupIcon className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">メンバー</span>
                </Link>
                <Link href="/settings" className={`flex flex-col items-center py-3 px-4 transition-colors ${pathname === '/settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    <CogIcon className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">設定</span>
                </Link>
            </nav>
        </footer>
    );
}
