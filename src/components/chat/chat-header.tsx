'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function ChatHeader() {
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="p-4 flex-shrink-0 flex items-center justify-between">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon">
          <ArrowLeft />
        </Button>
      </Link>
      <h1 className="text-2xl font-headline text-center font-bold text-primary relative right-[10px]">
        Studygram Students Community
      </h1>
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="text-destructive" />
      </Button>
    </div>
  );
}
