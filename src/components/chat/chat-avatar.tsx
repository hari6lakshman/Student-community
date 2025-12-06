import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/lib/types";

// Function to generate a consistent color from a string
const generateColor = (str: string) => {
  let hash = 0;
  if (str.length === 0) return '#000000';
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

export function ChatAvatar({ user }: { user: User }) {
  const color = generateColor(user.name);

  return (
    <Avatar className="w-auto h-8 px-3">
      <AvatarFallback 
        style={{ backgroundColor: 'transparent' }}
        className="text-foreground font-bold"
      >
        {user.name}
      </AvatarFallback>
    </Avatar>
  );
}
