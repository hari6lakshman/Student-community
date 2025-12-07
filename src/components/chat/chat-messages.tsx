import type { Message, User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatAvatar } from './chat-avatar';
import { File, Video, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User;
  onDeleteMessage: (id: string) => void;
  isLoading: boolean;
}

export function ChatMessages({ messages, currentUser, onDeleteMessage, isLoading }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 md:p-6 space-y-6">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!isLoading && messages.map((message) => {
          if (!message.student) return null; // Don't render message if student data isn't loaded yet
          const isCurrentUser = message.studentId === currentUser.id;
          return (
            <div
              key={message.id}
              className={cn(
                'flex flex-col gap-2 group',
                isCurrentUser ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-3',
                  isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <ChatAvatar user={{ id: message.student.id, name: message.student.studentName, email: message.student.email }} />
              </div>

              <div className={cn('flex flex-col gap-1.5', isCurrentUser ? 'items-end' : 'items-start ml-16')}>
                <div className={cn('flex items-end gap-3', isCurrentUser ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl flex flex-col border',
                      isCurrentUser
                        ? 'bg-background border-primary rounded-br-none'
                        : 'bg-background border-primary rounded-bl-none'
                    )}
                  >
                    {message.fileUrl && (
                      <div className="mb-2">
                        {message.fileType?.startsWith('image/') ? (
                          <Image
                            src={message.fileUrl}
                            alt={message.fileName || 'Uploaded image'}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-background/20 hover:bg-background/40 transition-colors">
                            {message.fileType?.startsWith('video/') ? <Video className="w-6 h-6"/> : message.fileType === 'application/pdf' ? <File className="w-6 h-6 text-red-500" /> : <File className="w-6 h-6"/>}
                            <span className="text-sm font-medium break-words">{message.fileName}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {message.message && <p className="text-sm font-body whitespace-pre-wrap text-primary">{message.message}</p>}
                  </div>
                  {isCurrentUser && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDeleteMessage(message.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                 {message.timestamp && <p className={cn("text-xs text-primary/80", isCurrentUser ? 'pr-12' : 'pl-16')}>
                  {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
