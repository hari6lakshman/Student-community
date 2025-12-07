'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendHorizonal, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendFile: (file: File) => void;
  isUploading: boolean;
}

export function ChatInput({ onSendMessage, onSendFile, isUploading }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (text.trim() && !isSending) {
      setIsSending(true);
      await onSendMessage(text);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
        });
        return;
      }
      onSendFile(file);
    }
  }

  return (
    <div className="p-4 flex-shrink-0">
       <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="relative">
        <Textarea
          placeholder="Type a message..."
          className="pr-24 min-h-[48px] resize-none rounded-2xl bg-muted/80 border-0 focus-visible:ring-1 focus-visible:ring-ring"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            className="hidden" 
            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={isUploading}
          />
          <Button size="icon" variant="ghost" className="rounded-full" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5 text-foreground/80" />}
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full" onClick={handleSend} disabled={!text.trim() || isSending}>
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5 text-primary" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
