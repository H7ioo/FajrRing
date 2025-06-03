import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { ArrowRight, Bell, Clock, Settings } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "./_components/feature-card";

const features = [
  {
    icon: Bell,
    title: "Automated Calls",
    description:
      "Receive reliable phone calls before Fajr prayer time, customized to wake you up gently.",
    iconBgClass: undefined,
    iconTextClass: "text-primary",
  },
  {
    icon: Clock,
    title: "Precise Timing",
    description:
      "Based on your exact location and preferred calculation method for accurate prayer times.",
    iconBgClass: undefined,
    iconTextClass: "text-secondary-foreground",
  },
  {
    icon: Settings,
    title: "Fully Customizable",
    description:
      "Adjust call timing, choose your calculation method, and manage your preferences easily.",
    iconBgClass: undefined,
    iconTextClass: "text-accent-foreground",
  },
];

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  const isLoggedIn = !!user;

  const primaryCta = isLoggedIn
    ? { href: "/dashboard", label: "Go to Dashboard" }
    : {
        href: { pathname: "/login", query: { tab: "signup" } },
        label: "Get Started Free",
      };

  const ctaSectionCta = isLoggedIn
    ? { href: "/dashboard", label: "Go to Dashboard" }
    : {
        href: { pathname: "/login", query: { tab: "signup" } },
        label: "Create Free Account",
      };

  return (
    <div className="from-background via-muted/10 to-secondary/5 flex min-h-screen flex-col bg-gradient-to-br">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          {/* Optional: Add subtle background patterns or shapes here */}
          <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="animate-fade-in text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your daily call to prayer,{" "}
              <span className="text-primary">personalized</span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-10 max-w-3xl text-lg sm:text-xl">
              Wake up peacefully for Fajr prayer with automated phone calls
              tailored to your location, prayer calculation method, and personal
              preferences.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:mb-16">
              <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Simple. Reliable. Personal.
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Everything you need for a consistent Fajr prayer routine,
                designed with care and precision.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  iconBgClass={feature.iconBgClass}
                  iconTextClass={feature.iconTextClass}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Start your consistent Fajr routine today
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              Join thousands of Muslims who trust FajrRing for their daily
              prayer calls.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link href={ctaSectionCta.href}>
                  {ctaSectionCta.label}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {!isLoggedIn && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <Link href="/faq">Learn More</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
