"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Calculator,
  Clock,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [location, setLocation] = useState("Istanbul, Turkey");
  const [calculationMethod, setCalculationMethod] = useState("diyanet");
  const [callOffset, setCallOffset] = useState([15]);
  const [phoneNumber, setPhoneNumber] = useState("+905551234567");
  const [customFajrAngle, setCustomFajrAngle] = useState("18.0");
  const [customIshaAngle, setCustomIshaAngle] = useState("17.0");
  const [isLoading, setIsLoading] = useState(false);

  const handleDetectLocation = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLocation("Istanbul, Turkey");
      setIsLoading(false);
      toast.success("Location detected", {
        description: "Your location has been updated to Istanbul, Turkey",
      });
    }, 1000);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Settings saved successfully", {
        description: "Your prayer call preferences have been updated",
      });
    }, 1000);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested", {
      description: "Please check your email for confirmation steps",
    });
  };

  const handleUpdatePhoneNumber = () => {
    toast.info("Phone number update", {
      description: "Please verify your new phone number via SMS",
    });
  };

  const calculationMethods = [
    { value: "isna", label: "ISNA (Islamic Society of North America)" },
    { value: "mwl", label: "MWL (Muslim World League)" },
    { value: "diyanet", label: "Diyanet (Turkey)" },
    { value: "egypt", label: "Egyptian General Authority" },
    { value: "makkah", label: "Umm Al-Qura (Makkah)" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your FajrRing experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Location Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Your location determines prayer times
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city, country"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleDetectLocation}
                  className="w-full"
                  loading={isLoading}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Detect My Location
                </Button>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-muted-foreground text-sm">
                <strong>Timezone:</strong> GMT+3 (Turkey Time)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prayer Calculation */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Calculator className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Prayer Calculation Method</CardTitle>
                <CardDescription>
                  Choose the method that matches your local mosque
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calculation-method">Calculation Method</Label>
              <Select
                value={calculationMethod}
                onValueChange={setCalculationMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation method" />
                </SelectTrigger>
                <SelectContent>
                  {calculationMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {calculationMethod === "custom" && (
              <div className="bg-muted grid grid-cols-2 gap-4 rounded-lg p-4">
                <div className="space-y-2">
                  <Label htmlFor="fajr-angle">Fajr Angle</Label>
                  <Input
                    id="fajr-angle"
                    type="number"
                    value={customFajrAngle}
                    onChange={(e) => setCustomFajrAngle(e.target.value)}
                    placeholder="18.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isha-angle">Isha Angle</Label>
                  <Input
                    id="isha-angle"
                    type="number"
                    value={customIshaAngle}
                    onChange={(e) => setCustomIshaAngle(e.target.value)}
                    placeholder="17.0"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call Timing */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Clock className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Fajr Call Timing</CardTitle>
                <CardDescription>
                  When should we call you before Fajr prayer?
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label>
                Call me {callOffset[0]} minutes{" "}
                {callOffset[0]! >= 0 ? "before" : "after"} Fajr
              </Label>
              <div className="px-2">
                <Slider
                  value={callOffset}
                  onValueChange={setCallOffset}
                  max={60}
                  min={-60}
                  step={5}
                  className="w-full"
                />
                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                  <span>60 min before</span>
                  <span>At Fajr time</span>
                  <span>60 min after</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Phone className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Phone Number</CardTitle>
                <CardDescription>
                  The number we&apos;ll call for your Fajr reminder
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-foreground font-medium">{phoneNumber}</p>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-green-600">Verified</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleUpdatePhoneNumber}>
                <Phone className="mr-2 h-4 w-4" />
                Update Phone Number
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <User className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage your account settings and data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" />
                Manage Profile
              </Button>
              <Button variant="outline">
                <Shield className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
            <div className="border-border border-t pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full md:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete My FajrRing Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className={buttonVariants({ variant: "destructive" })}
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSaveSettings} loading={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
