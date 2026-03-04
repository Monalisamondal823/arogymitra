import { LoginForm } from "@/components/auth/login-form";
import { HeartPulse } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <LoginForm />
      </div>
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center text-center p-8">
        <HeartPulse className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold">ArogyaMitra</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your AI-Powered Digital Health Partner.
        </p>
      </div>
    </div>
  );
}
