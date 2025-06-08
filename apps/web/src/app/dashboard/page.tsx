import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/auth";
import {
  Bell,
  BellOff,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Settings,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

function getNextFajrTime() {
  const nextCallTime = new Date();
  nextCallTime.setDate(nextCallTime.getDate() + 1);
  nextCallTime.setHours(5, 15, 0, 0); // 5:15 AM tomorrow
  return nextCallTime;
}

// Helper function to format phone number for display
function formatPhoneForDisplay(phone: string) {
  if (!phone) return "Not set";
  return phone.replace(
    /(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/,
    "+$1 *** *** **$4",
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const nextCallTime = getNextFajrTime();
  const userName = user.name?.split(" ")[0] ?? "User";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">
          Assalamu Alaikum, {userName}! 🌙
        </h1>
        <p className="text-muted-foreground">
          Welcome to your FajrRing dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Main Call Status Card */}
        <Card className="border-primary/20 shadow-lg lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <Bell className="text-primary h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Next FajrRing Call</CardTitle>
                  <CardDescription>
                    Your personalized wake-up call
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm font-medium">
                    Date & Time
                  </p>
                  <p className="text-foreground text-2xl font-bold">
                    {nextCallTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-primary text-xl font-semibold">
                    {nextCallTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                  </p>
                </div>

                <div className="text-muted-foreground flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Istanbul, Turkey (GMT+3)</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Update Settings
                  </Link>
                </Button>

                <Button variant="outline" className="w-full">
                  <BellOff className="mr-2 h-4 w-4" />
                  Pause Calls
                </Button>

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/dashboard/history">
                    <Clock className="mr-2 h-4 w-4" />
                    View Call History
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-primary h-5 w-5" />
              <CardTitle>Call Statistics</CardTitle>
            </div>
            <CardDescription>Your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Calls this week</span>
                <span className="text-foreground font-semibold">6/7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Success rate</span>
                <span className="text-primary font-semibold">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current streak</span>
                <span className="text-foreground font-semibold">15 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total calls</span>
                <span className="text-foreground font-semibold">127</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="text-primary h-5 w-5" />
              <CardTitle>Current Settings</CardTitle>
            </div>
            <CardDescription>Your prayer call preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Calculation Method
                </p>
                <p className="text-foreground font-semibold">
                  Diyanet (Turkey)
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Call Offset
                </p>
                <p className="text-foreground font-semibold">
                  15 minutes before Fajr
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Phone Number
                </p>
                <div className="flex items-center space-x-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <p className="text-foreground font-semibold">
                    {formatPhoneForDisplay("905551234567")}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/settings">Modify Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="text-primary h-5 w-5" />
              <CardTitle>Quick Actions</CardTitle>
            </div>
            <CardDescription>Manage your FajrRing experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                asChild
                variant="outline"
                className="h-auto flex-col space-y-2 p-4"
              >
                <Link href="/dashboard/settings">
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col space-y-2 p-4"
              >
                <Link href="/dashboard/history">
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">Call History</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col space-y-2 p-4"
              >
                <BellOff className="h-6 w-6" />
                <span className="text-sm">Pause Service</span>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto flex-col space-y-2 p-4"
              >
                <Link href="/support">
                  <Phone className="h-6 w-6" />
                  <span className="text-sm">Support</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
