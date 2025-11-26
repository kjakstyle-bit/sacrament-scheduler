import React from 'react';
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./main.css";
import { cn } from "@/lib/utils";
import { FooterNavigation } from "./components/FooterNavigation";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "聖餐担当表",
  description: "聖餐の担当を管理するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={cn(notoSansJP.className, "min-h-screen bg-background font-sans antialiased")}>
        <main className="relative flex min-h-screen flex-col pb-20">
          {children}
        </main>
        <FooterNavigation />
      </body>
    </html>
  );
}