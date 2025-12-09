'use client';

import type { Message, User } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { useToast } from '@/hooks/use-toast';
import { messages as initialMessages, users as allUsers } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

interface ChatLayoutProps {
  currentUser: User;
}

// A simple function to simulate a server timestamp
const getTimestamp = () => new Date();

export function ChatLayout({ currentUser }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { toast } = useToast();

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      message: text,
      studentId: currentUser.id,
      timestamp: getTimestamp(),
      student: {
        id: currentUser.id,
        studentName: currentUser.name,
        email: currentUser.email,
      }
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  const sendFile = (file: File) => {
    toast({
      variant: "destructive",
      title: "File uploads disabled",
      description: "File sharing is not available without a cloud backend.",
    });
  };

  const deleteMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  }

  return (
    <Card className="w-full max-w-4xl h-[85vh] flex flex-col border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <ChatHeader />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      <ChatMessages
        messages={messages}
        currentUser={currentUser}
        onDeleteMessage={deleteMessage}
        isLoading={false}
      />
      <ChatInput onSendMessage={sendMessage} onSendFile={sendFile} isUploading={false} />
    </Card>
  );
}
