'use client';

import type { Message, User } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { v4 as uuidv4 } from 'uuid';

// A simple function to simulate a server timestamp
const getTimestamp = () => new Date();

export function ChatLayout({ currentUser }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const savedMessages = localStorage.getItem('studygram-messages');
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error('Failed to parse messages from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('studygram-messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to localStorage', error);
    }
  }, [messages]);

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
      <ChatInput onSendMessage={sendMessage} />
    </Card>
  );
}

interface ChatLayoutProps {
  currentUser: User;
}
