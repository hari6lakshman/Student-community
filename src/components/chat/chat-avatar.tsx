import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatAvatarProps {
    user: {
        id: string;
        name: string;
        email: string;
    }
}

export function ChatAvatar({ user }: ChatAvatarProps) {
  return (
    <Avatar className="w-auto h-8 px-3">
      <AvatarFallback 
        style={{ backgroundColor: 'transparent' }}
        className="text-primary font-bold"
      >
        {user.name}
      </AvatarFallback>
    </Avatar>
  );
}
