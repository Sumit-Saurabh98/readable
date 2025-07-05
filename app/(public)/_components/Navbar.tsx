"use client"
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { authClient } from "@/lib/auth.client";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

const navigationItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Courses",
        href: "/courses",
    },
    {
        name: "Dashboard",
        href: "/admin",
    },
]

export default function Navbar() {
    const {data:session, isPending} = authClient.useSession();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md shadow-sm">
  <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
    
    {/* Logo Section */}
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.png" alt="Readable Logo" width={36} height={36} className="rounded-full shadow-sm" />
      <span className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors">Readable</span>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center justify-center gap-6">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </nav>

    {/* Right Section: Theme Toggle + Auth Buttons */}
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {isPending ? null : session ? (
        <UserDropdown email={session.user.email} name={session.user.name} image={session.user.image || ""} />
      ) : (
        <>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Login
          </Link>
          <Link href="/login" className={buttonVariants({ size: "sm" })}>
            Get Started
          </Link>
        </>
      )}
    </div>
  </div>
</header>

    );
}