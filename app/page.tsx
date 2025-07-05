"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth.client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const { data: session, isPending, error, refetch } = authClient.useSession();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Signed out successfully");
        },
      },
    });
  }
  return (
    <div>
      <h1 className="text-3xl text-red-400">Hello World</h1>
      <ThemeToggle />

      {session ? (
        <div>
          <p>{session.user?.name}</p>
          <Button onClick={signOut}>Logout</Button>
        </div>
      ) : (
        <Button>Login</Button>
      )}
    </div>
  );
}
