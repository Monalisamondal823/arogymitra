"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { doc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse, Loader2 } from "lucide-react";

// Simple inline SVG for Google icon
const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 120.8 109.8 8 244 8c66.8 0 126 25.4 170.2 66.4l-64.8 64.2c-20.5-18.7-47.5-31.5-79.4-31.5-62.3 0-113.3 51.9-113.3 115.8 0 63.9 51 115.8 113.3 115.8 72.8 0 101.4-49.8 104.9-76.3H244V201.2h238.2c4.4 24.3 6.8 49.3 6.8 76.6z"></path>
    </svg>
  );

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const displayName = `${values.firstName} ${values.lastName}`;
      await updateProfile(user, { displayName });
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userData = {
          id: user.uid,
          username: displayName,
          email: user.email,
          firstName: values.firstName,
          lastName: values.lastName,
          userRole: 'Patient', // Default role
          createdAt: new Date().toISOString(),
      };
      
      setDocumentNonBlocking(userDocRef, userData, {});
      
      toast({
        title: "Account Created",
        description: "You have been successfully signed up.",
      });
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Google Sign-In/Up Handler
  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const additionalInfo = getAdditionalUserInfo(result);

        let toastTitle = "Login Successful";
        let toastDescription = `Welcome back, ${user.displayName || 'User'}!`;

        // If it's a new user, create a document in Firestore
        if (additionalInfo?.isNewUser) {
            const displayName = user.displayName || '';
            const nameParts = displayName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const userDocRef = doc(firestore, "users", user.uid);
            const userData = {
                id: user.uid,
                username: displayName,
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                userRole: 'Patient', // Default role
                createdAt: new Date().toISOString(),
            };
            setDocumentNonBlocking(userDocRef, userData, {});
            
            toastTitle = "Account Created";
            toastDescription = "You have been successfully signed up with Google.";
        }

        toast({
            title: toastTitle,
            description: toastDescription,
        });
        router.push("/dashboard");

    } catch (error: any) {
        console.error("Google Sign-Up Error:", error);
        let description = error.message || "An unexpected error occurred.";
        if (error.code === 'auth/operation-not-allowed') {
            description = "Google Sign-In is not enabled for this project. You must enable it in the Firebase console.";
        }
        toast({
            variant: "destructive",
            title: "Google Sign-Up Failed",
            description: description,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  }


  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
            <HeartPulse className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
        <CardDescription>Join ArogyaMitra to manage your health.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
                 <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Jane" {...field} disabled={isLoading || isGoogleLoading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Doe" {...field} disabled={isLoading || isGoogleLoading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} disabled={isLoading || isGoogleLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isGoogleLoading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                Or continue with
                </span>
            </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={isLoading || isGoogleLoading}>
            {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <GoogleIcon />
            )}
            Google
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <p>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
                Log in
            </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
