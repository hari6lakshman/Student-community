'use client';

import { useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (text.trim() && !isSending) {
      setIsSending(true);
      onSendMessage(text);
      setText('');
      setIsSending(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 flex-shrink-0">
       <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="relative">
        <Textarea
          placeholder="Type a message..."
          className="pr-16 min-h-[48px] resize-none rounded-2xl bg-muted/80 border-0 focus-visible:ring-1 focus-visible:ring-ring"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
          <Button size="icon" variant="ghost" className="rounded-full" onClick={handleSend} disabled={!text.trim() || isSending}>
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5 text-primary" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
