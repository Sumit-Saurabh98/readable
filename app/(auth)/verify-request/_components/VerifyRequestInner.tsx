// app/(auth)/verify-request/verify-request-inner.tsx

'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestInner() {
  const [emailPending, startTransition] = useTransition();
  const [otp, setOtp] = useState("");
  const params = useSearchParams();
  const email = params.get("email") as string;
  const router = useRouter();
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verified successfully");
            router.push("/");
          },
          onError: () => {
            toast.error("Invalid OTP");
          },
        },
      });
    });
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification code to your email address. Please copy
          and paste it here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            maxLength={6}
            className="gap-2"
            value={otp}
            onChange={(e) => setOtp(e)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digits code sent to your email
          </p>
        </div>
        <Button
          disabled={emailPending || !isOtpCompleted}
          onClick={verifyOtp}
          className="w-full"
        >
          {emailPending ? (
            <>
              <Loader2 size={4} className="animate-spin" />
              <span className="ml-2">Verifying...</span>
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
