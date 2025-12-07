
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

export type State = {
  errors?: {
    email?: string[];
    name?: string[];
  } | null;
  message?: string | null;
};
