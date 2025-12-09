'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginSchema, type State } from '@/lib/actions';
import type { Message, User } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<State>({ message: null, errors: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear any previous user session when the login page loads
    sessionStorage.removeItem('studygram-user');
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setState({ message: null, errors: null });

    const formData = new FormData(event.currentTarget);
    const validatedFields = LoginSchema.safeParse({
      email: formData.get('email'),
      name: formData.get('name'),
    });

    if (!validatedFields.success) {
      setState({
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Invalid fields. Failed to login.',
      });
      setIsSubmitting(false);
      return;
    }

    const { email, name } = validatedFields.data;

    // Use email as the unique ID for the user
    const user: User = {
        id: email,
        email,
        name
    };

    // Update name in existing messages if user logs in with same email but different name
    try {
        const savedMessages = localStorage.getItem('studygram-messages');
        if (savedMessages) {
            let messages: Message[] = JSON.parse(savedMessages);
            let messagesUpdated = false;
            messages.forEach(msg => {
                // Check if the message belongs to the current user and if the name needs updating
                if (msg.studentId === email && msg.student?.studentName !== name) {
                    if (msg.student) {
                      msg.student.studentName = name;
                    }
                    messagesUpdated = true;
                }
            });

            if (messagesUpdated) {
                localStorage.setItem('studygram-messages', JSON.stringify(messages));
            }
        }
    } catch (error) {
        console.error("Failed to update messages in localStorage", error);
    }

    // Store user info in session and navigate to chat
    sessionStorage.setItem('studygram-user', JSON.stringify(user));
    router.push('/chat');
  };


  return (
    <Card className="w-full max-w-sm border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline font-bold text-primary">Studygram</CardTitle>
        <CardDescription className="font-body text-foreground/80">
          Join the student community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            {state?.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="text-sm text-destructive" key={error}>{error}</p>
              ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input id="name" name="name" placeholder="Your Name" required />
            {state?.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="text-sm text-destructive" key={error}>{error}</p>
              ))}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Join Chat
          </Button>
          {state?.message && <p className="text-sm text-destructive">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
