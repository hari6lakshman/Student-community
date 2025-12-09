'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ChatHeader() {
  const router = useRouter();

  return (
    <div className="p-4 flex-shrink-0 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-6 w-6" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="text-2xl font-headline text-center font-bold text-primary grow">
        Studygram Students Community
      </h1>
      <div className="w-10" />
    </div>
  );
}
