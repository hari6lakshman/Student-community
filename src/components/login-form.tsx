'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, FormEvent } from 'react';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth, useUser } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { LoginSchema, type State } from '@/lib/actions';

export function LoginForm() {
  const router = useRouter();
  const [state, setState] = useState<State>({ message: null, errors: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const auth = useAuth();
  const { user } = useUser();

  // Effect to sign out any existing user when the login form mounts
  useEffect(() => {
    if (auth && user) {
        signOut(auth);
    }
  }, [auth]);

  useEffect(() => {
    // This effect runs when the user object becomes available after a successful sign-in
    if (user && isSubmitting) {
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
  }, [user, isSubmitting, router]);
  
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

    // If validation is successful, initiate anonymous sign-in
    if (auth) {
        initiateAnonymousSignIn(auth);
    }
  };


  return (
    <Card className="w-full max-w-sm border-2 border-primary shadow-2xl shadow-primary/20 rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline font-bold text-primary">Studygram</CardTitle>
        <CardDescription className="font-body text-foreground/80">
          {isRedirecting ? 'Redirecting to chat...' : 'Join the student community'}
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
            {isSubmitting || isRedirecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Join Chat
          </Button>
          {state?.message && state.message !== 'success' && <p className="text-sm text-destructive">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
