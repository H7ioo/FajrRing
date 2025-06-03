import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="from-background via-muted/30 to-secondary/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <Logo size="lg" />
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-primary mb-4 text-6xl font-bold">
              404
            </CardTitle>
            <h1 className="text-foreground mb-2 text-2xl font-semibold">
              Page Not Found
            </h1>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            <div className="border-border border-t pt-4">
              <p className="text-muted-foreground mb-2 text-sm">
                Need help? Try these links:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/faq"
                  className="text-primary text-sm hover:underline"
                >
                  FAQ
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/contact"
                  className="text-primary text-sm hover:underline"
                >
                  Contact
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link
                  href="/about"
                  className="text-primary text-sm hover:underline"
                >
                  About
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
