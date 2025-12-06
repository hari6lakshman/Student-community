import type { Message, User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatAvatar } from './chat-avatar';
import { File, Video, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User;
  onDeleteMessage: (id: string) => void;
}

export function ChatMessages({ messages, currentUser, onDeleteMessage }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 md:p-6 space-y-6">
        {messages.map((message, index) => {
          const isCurrentUser = message.user.name === currentUser.name;
          return (
            <div
              key={index}
              className={cn(
                'flex items-end gap-3 group',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isCurrentUser && (
                <div className="flex flex-col items-start">
                    <ChatAvatar user={message.user} />
                </div>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl flex flex-col',
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted/50 rounded-bl-none'
                )}
              >
                {message.file && (
                  <div className="mb-2">
                    {message.file.type.startsWith('image/') ? (
                      <Image
                        src={message.file.url}
                        alt={message.file.name}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-background/20 hover:bg-background/40 transition-colors">
                        {message.file.type.startsWith('video/') ? <Video className="w-6 h-6"/> : message.file.type === 'application/pdf' ? <File className="w-6 h-6 text-red-500" /> : <File className="w-6 h-6"/>}
                        <span className="text-sm font-medium truncate">{message.file.name}</span>
                      </a>
                    )}
                  </div>
                )}

                {message.text && <p className="text-sm font-body whitespace-pre-wrap">{message.text}</p>}
                
                <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/60" : "text-foreground/60", "text-right")}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
               {isCurrentUser && (
                 <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDeleteMessage(message.id)}>
                   <Trash2 className="h-4 w-4" />
                 </Button>
               )}
              {isCurrentUser && (
                 <ChatAvatar user={message.user} />
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
