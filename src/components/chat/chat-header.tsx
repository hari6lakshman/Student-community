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
      <h1 className="text-2xl font-headline text-center font-bold text-primary relative right-[10px]">
        Studygram Students Community
      </h1>
      <div className="w-10"></div> {/* Spacer for balance */}
    </div>
  );
}
