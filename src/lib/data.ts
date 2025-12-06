import type { Message } from './types';

export const users = {
  alex: { name: 'Alex Doe', avatarUrl: 'https://i.pravatar.cc/150?u=alex' },
  sam: { name: 'Sam Smith', avatarUrl: 'https://i.pravatar.cc/150?u=sam' },
  casey: { name: 'Casey Jones', avatarUrl: 'https://i.pravatar.cc/150?u=casey' },
  jordan: { name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?u=jordan' },
};

export const messages: Message[] = [
  {
    id: '1',
    user: users.alex,
    text: "Hey everyone! How's the studying for finals going?",
    timestamp: new Date().setMinutes(new Date().getMinutes() - 60),
  },
  {
    id: '2',
    user: users.sam,
    text: "It's tough, but we're getting there. I'm stuck on the last chapter of the history book.",
    timestamp: new Date().setMinutes(new Date().getMinutes() - 58),
  },
  {
    id: '3',
    user: users.casey,
    text: 'Oh, I just finished that! I have some notes if you want them.',
    timestamp: new Date().setMinutes(new Date().getMinutes() - 55),
  },
  {
    id: '4',
    user: users.sam,
    text: 'That would be amazing, Casey! Could you share them?',
    timestamp: new Date().setMinutes(new Date().getMinutes() - 54),
  },
  {
    id: '5',
    user: users.casey,
    text: "Sure, I'll upload them now.",
    timestamp: new Date().setMinutes(new Date().getMinutes() - 53),
    file: {
        name: 'History-Chapter5-Notes.pdf',
        url: '#',
        type: 'application/pdf',
    }
  },
  {
    id: '6',
    user: users.jordan,
    text: "Thanks, Casey! You're a lifesaver. Anyone up for a virtual study group later tonight?",
    timestamp: new Date().setMinutes(new Date().getMinutes() - 45),
  },
  {
    id: '7',
    user: users.alex,
    text: "I'm in! What time works for everyone?",
    timestamp: new Date().setMinutes(new Date().getMinutes() - 44),
  },
];
