'use client';

import type { Message, User } from '@/lib/types';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessagesJSON = localStorage.getItem('chatMessages');
      const savedMessages: Message[] = savedMessagesJSON ? JSON.parse(savedMessagesJSON) : [];

      // Update names for existing messages if the email matches
      const updatedMessages = savedMessages.map(msg => {
        if (msg.user.email === user.email && msg.user.name !== user.name) {
          return { ...msg, user: { ...msg.user, name: user.name } };
        }
        return msg;
      });

      setMessages(updatedMessages);
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      user,
      text,
      timestamp: Date.now(),
    };
    setMessages([...messages, newMessage]);
  };
  
  const sendFile = (file: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
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

  const deleteMessage = (id: string) => {
    const newMessages = messages.filter(msg => msg.id !== id);
    setMessages(newMessages);
  }

  return (
    <Card className="w-full max-w-4xl h-[85vh] flex flex-col border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <ChatHeader />
      <ChatMessages messages={messages} currentUser={user} onDeleteMessage={deleteMessage} />
      <ChatInput onSendMessage={sendMessage} onSendFile={sendFile} />
    </Card>
  );
}
