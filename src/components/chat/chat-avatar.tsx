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
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const color = generateColor(user.name);

  return (
    <Avatar className="w-8 h-8">
      <AvatarFallback 
        style={{ backgroundColor: color }}
        className="text-white font-bold"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
