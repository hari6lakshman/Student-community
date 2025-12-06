import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ChatLayout } from '@/components/chat/chat-layout';
import { messages as initialMessages } from '@/lib/data';
import type { User } from '@/lib/types';

export default function ChatPage() {
  const cookieStore = cookies();
  const studentName = cookieStore.get('student_name')?.value;
  const studentEmail = cookieStore.get('student_email')?.value;

  if (!studentName || !studentEmail) {
    redirect('/');
  }

  // Create a user object for the current student.
  // In a real app, this would come from a database.
  const currentUser: User = {
    name: studentName,
    email: studentEmail,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
      <ChatLayout user={currentUser} initialMessages={initialMessages} />
    </main>
  );
}
