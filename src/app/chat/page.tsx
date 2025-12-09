'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatLayout } from '@/components/chat/chat-layout';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('studygram-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-foreground/80">Loading...</p>
      </main>
    );
  }

  if (!user) {
    // This will be caught by the useEffect, but as a fallback
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
      <ChatLayout currentUser={user} />
    </main>
  );
}
