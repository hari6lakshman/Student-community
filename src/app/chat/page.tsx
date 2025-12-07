'use client';

import { redirect } from 'next/navigation';
import { ChatLayout } from '@/components/chat/chat-layout';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-foreground/80">Loading...</p>
      </main>
    );
  }

  if (!user) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
      <ChatLayout currentUser={{ id: user.uid, name: user.displayName || 'Anonymous', email: user.email || '' }} />
    </main>
  );
}
