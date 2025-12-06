import type { Message, User } from './types';

export const users: { [key: string]: User } = {
  alex: { name: 'Alex Doe', email: 'alex@example.com' },
  sam: { name: 'Sam Smith', email: 'sam@example.com' },
  casey: { name: 'Casey Jones', email: 'casey@example.com' },
  jordan: { name: 'Jordan Lee', email: 'jordan@example.com' },
};

export const messages: Message[] = [];
