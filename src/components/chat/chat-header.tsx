import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ChatHeader() {
  return (
    <div className="p-4 flex-shrink-0 flex items-center justify-between">
      <Link href="/" passHref>
        <Button variant="ghost" size="icon">
          <ArrowLeft />
        </Button>
      </Link>
      <h1 className="text-2xl font-headline text-center text-primary">
        Studygram Students Community
      </h1>
      <div className="w-8"></div> {/* Spacer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[calc(100%-2rem)] bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
}
