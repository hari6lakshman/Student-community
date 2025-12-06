'use client';

import type { Message, User } from '@/lib/types';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatLayoutProps {
  user: User;
  initialMessages: Message[];
}

export function ChatLayout({ user, initialMessages }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      user,
      text,
      timestamp: Date.now(),
    };
    setMessages([...messages, newMessage]);
  };
  
  const sendFile = (file: File) => {
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      user,
      text: ``,
      timestamp: Date.now(),
      file: {
        name: file.name,
        url: URL.createObjectURL(file), // Mock URL
        type: file.type,
      }
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <Card className="w-full max-w-4xl h-[85vh] flex flex-col border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <ChatHeader />
      <ChatMessages messages={messages} currentUser={user} />
      <ChatInput onSendMessage={sendMessage} onSendFile={sendFile} />
    </Card>
  );
}
