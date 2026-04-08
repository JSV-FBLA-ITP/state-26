'use client';

import { usePathname } from 'next/navigation';
import { ChatbaseWidget } from '@/components/ChatbaseWidget';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChatWidget = pathname !== '/login';

  return (
    <>
      {children}
      {showChatWidget && <ChatbaseWidget />}
    </>
  );
}
