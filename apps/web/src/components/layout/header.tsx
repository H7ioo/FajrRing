import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Navigation Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {user ? (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-accent hover:text-accent-foreground px-2 text-xs font-medium sm:px-4 sm:text-sm"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="px-2 text-xs font-medium sm:px-4 sm:text-sm"
                  >
                    <Link href="/api/signout">Sign Out</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-foreground hover:bg-accent hover:text-accent-foreground px-2 text-xs font-medium sm:px-4 sm:text-sm"
                  >
                    <Link
                      href={{ pathname: "/login", query: { tab: "signin" } }}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="px-2 text-xs font-medium sm:px-4 sm:text-sm"
                  >
                    <Link
                      href={{ pathname: "/login", query: { tab: "signup" } }}
                    >
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
