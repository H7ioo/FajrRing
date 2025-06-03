import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Globe, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">About FajrRing</CardTitle>
        <p className="text-muted-foreground">
          Your trusted companion for Fajr prayer
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            FajrRing was created to help Muslims worldwide maintain a consistent
            Fajr prayer routine. We understand the challenges of waking up for
            the earliest prayer, especially during winter months when Fajr time
            can be as early as 4:30 AM. Our automated phone call service
            provides a reliable, personalized wake-up call that respects your
            location, preferences, and chosen calculation method.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Bell className="text-primary h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Reliability</h3>
              <p className="text-muted-foreground text-sm">
                Dependable automated calls delivered precisely when you need
                them
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-secondary/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-secondary-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Care</h3>
              <p className="text-muted-foreground text-sm">
                Built with love and respect for the Islamic community worldwide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-accent/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Globe className="text-accent-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Global</h3>
              <p className="text-muted-foreground text-sm">
                Supporting Muslims in every timezone with accurate prayer times
              </p>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="mb-1 font-medium">Set Your Preferences</h4>
                <p className="text-muted-foreground">
                  Choose your location, calculation method, and preferred call
                  timing
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="mb-1 font-medium">Automated Scheduling</h4>
                <p className="text-muted-foreground">
                  Our system calculates your daily Fajr time and schedules your
                  call
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="mb-1 font-medium">Wake Up Peacefully</h4>
                <p className="text-muted-foreground">
                  Receive your personalized wake-up call before Fajr prayer time
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Our Values</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">Privacy First</h4>
              <p className="text-muted-foreground text-sm">
                Your personal information is protected and never shared with
                third parties
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Accessibility</h4>
              <p className="text-muted-foreground text-sm">
                Free service available to Muslims worldwide, regardless of
                location
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Accuracy</h4>
              <p className="text-muted-foreground text-sm">
                Precise prayer time calculations using established Islamic
                methods
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Community</h4>
              <p className="text-muted-foreground text-sm">
                Supporting the global Muslim community in maintaining spiritual
                practices
              </p>
            </div>
          </div>
        </section>

        <section className="bg-muted rounded-lg p-6">
          <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            We&apos;d love to hear from you! Whether you have questions,
            feedback, or need support, don&apos;t hesitate to reach out.
          </p>
          <Link
            href="/contact"
            className="text-primary font-medium hover:underline"
          >
            Get in touch →
          </Link>
        </section>
      </CardContent>
    </Card>
  );
}
