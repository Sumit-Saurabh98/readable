"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth.client";
import { GithubIcon, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
export function LoginForm() {
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Sign in with Github, You will be redirected...");
          },
          onError: (error) => {
            toast.error(error.error.message ?? "Sign in with Github failed");
          },
        },
      });
    });
  }

  async function signInWithEmail() {
      startEmailTransition(async () => {
          await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "sign-in",
            fetchOptions: {
                onSuccess: () =>{
                    toast.success("Verification OTP sent to your email");
                    router.push(`/verify-request?email=${email}`);
                },
                onError: (error) => {
                    toast.error(error.error.message ?? "Error sending the otp");
                }
            }
          })
      })
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back!</CardTitle>
        <CardDescription>
          Login with your Github or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={githubPending}
          onClick={signInWithGithub}
          className="w-full "
          variant={"outline"}
        >
          {githubPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              <span>Sign in with Github</span>
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" id="email" placeholder="john@example.com" />
          </div>

          <Button disabled={emailPending} onClick={signInWithEmail}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <><Send className="size-4" />
                <span>Sign in with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
