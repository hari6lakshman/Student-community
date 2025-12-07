'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { cookies } from 'next/headers';

const LoginSchema = z.object({
  email: z.string({ required_error: 'Email is required.' }).email({ message: 'Please enter a valid email address.' }).min(1, { message: 'Email is required.' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

export type State = {
  errors?: {
    email?: string[];
    name?: string[];
  };
  message?: string | null;
};

export async function loginUser(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to login.',
    };
  }

  const { name, email } = validatedFields.data;
  
  cookies().set('student_name', name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
  });
  cookies().set('student_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
  });

  // Redirect is now handled client-side after auth
  return { message: "success" };
}
