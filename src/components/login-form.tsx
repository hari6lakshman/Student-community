'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser, type State } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { useAuth, useUser } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(loginUser, initialState);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const auth = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (state?.message === 'success' && auth) {
      const form = document.querySelector('form') as HTMLFormElement;
      const formData = new FormData(form);
      const email = formData.get('email') as string;
      // Using a fixed password because we're essentially using email as a unique ID
      const password = 'password'; 
      initiateEmailSignIn(auth, email, password);
    }
  }, [state, auth]);

  useEffect(() => {
    if (user) {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) {
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
  
        const studentRef = doc(getFirestore(), 'students', user.uid);
        setDocumentNonBlocking(studentRef, {
          id: user.uid,
          email: email,
          studentName: name,
        }, { merge: true });
        
        setIsRedirecting(true);
        router.push('/chat');
      }
    }
  }, [user, router]);
  

  return (
    <Card className="w-full max-w-sm border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline font-bold text-primary">Studygram</CardTitle>
        <CardDescription className="font-body text-foreground/80">
          {isRedirecting ? 'Redirecting to chat...' : 'Join the student community'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
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
          <SubmitButton />
          {state?.message && state.message !== 'success' && <p className="text-sm text-destructive">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
