'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser, type State } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Join Chat
    </Button>
  );
}

export function LoginForm() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(loginUser, initialState);

  return (
    <Card className="w-full max-w-sm border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline text-primary">Studygram</CardTitle>
        <CardDescription className="font-body text-foreground/80">Join the student community</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="text-sm text-destructive" key={error}>{error}</p>
              ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input id="name" name="name" placeholder="Your Name" required />
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="text-sm text-destructive" key={error}>{error}</p>
              ))}
          </div>
          <SubmitButton />
          {state.message && <p className="text-sm text-destructive">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
