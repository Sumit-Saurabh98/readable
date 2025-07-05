import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4 md:left-8 md:top-8",
        })}
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 self-center font-semibold text-lg text-primary"
        >
          <div className="w-10 h-10 p-1 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Readable Logo"
              width={28}
              height={28}
              className="rounded-full"
            />
          </div>
          <span className="text-xl font-bold tracking-wide">Readable</span>
        </Link>
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground"> By clicking continue, you agree to our <span className="hover:text-primary hover:underline hover:cursor-pointer">Terms of Service</span > and <span className="hover:text-primary hover:underline hover:cursor-pointer">Privacy Policy</span>. </div>
      </div>
    </div>
  );
}
