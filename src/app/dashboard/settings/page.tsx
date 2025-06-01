"use client";

import { PhoneInput } from "@/components/phone-input";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  PrayerCalculationMethodEnum,
  prayerCalculationMethods,
} from "@/lib/aladhan";
import { addMinutesToTimeString } from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  AddressAutocompleteInput,
  type LocationData,
} from "./_components/address-autocomplete-input";
import { DetectLocation } from "./_components/detect-location";

const settingsSchema = z.object({
  location: z.string().min(1, "Location is required"),
  locationData: z
    .object({
      placeId: z.string(),
      displayName: z.string(),
      formattedAddress: z.string(),
      city: z.string(),
      country: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  calculationMethod: PrayerCalculationMethodEnum,
  callOffset: z.array(z.number()).length(1),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  customFajrAngle: z.string().optional(),
  customIshaAngle: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      location: "",
      locationData: undefined,
      calculationMethod: undefined,
      callOffset: [15],
      phoneNumber: "+905551234567",
      customFajrAngle: "18.0",
      customIshaAngle: "17.0",
    },
  });

  console.log(form.watch());

  const watchedLocationData = form.watch("locationData");

  // TODO: timezone should also be saved
  const { data: timezone, isFetching: isFetchingTimezone } =
    api.geo.getTimezone.useQuery(
      {
        lat: watchedLocationData?.latitude ?? 0,
        lng: watchedLocationData?.longitude ?? 0,
      },
      {
        enabled: !!(
          watchedLocationData?.latitude && watchedLocationData?.longitude
        ),
        placeholderData: (data) => data,
      },
    );

  const timezoneInfo = useMemo(() => {
    if (
      timezone?.rawOffset !== undefined &&
      timezone?.dstOffset !== undefined &&
      timezone?.timeZoneName
    ) {
      const offset = (timezone.rawOffset + timezone.dstOffset) / 3600;
      const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
      return `GMT${offsetString} (${timezone.timeZoneName})`;
    } else {
      const now = new Date();
      const offset = -now.getTimezoneOffset() / 60;
      const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
      return `GMT${offsetString} (Local Time)`;
    }
  }, [timezone?.rawOffset, timezone?.dstOffset, timezone?.timeZoneName]);

  const { data: prayerTimings, isFetching: isFetchingPrayerTimings } =
    api.aladhan.getPrayerTimingsByDate.useQuery(
      {
        dateString: new Date()
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
        latitude: watchedLocationData?.latitude ?? 0,
        longitude: watchedLocationData?.longitude ?? 0,
      },
      {
        enabled: !!(
          watchedLocationData?.latitude && watchedLocationData?.longitude
        ),
        placeholderData: (data) => data,
      },
    );

  // const watchedCalculationMethod = form.watch("calculationMethod");

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    console.log("Form data:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Settings saved successfully", {
      description: "Your prayer call preferences have been updated",
    });
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested", {
      description: "Please check your email for confirmation steps",
    });
  };

  const handleVerifyPhoneNumber = () => {
    toast.info("Phone number verification", {
      description: "Please enter the verification code sent to your phone",
    });
  };

  const handleUpdatePhoneNumber = () => {
    toast.info("Phone number update", {
      description: "Please verify your new phone number via SMS",
    });
  };

  // MEMOIZED CALLBACK for AddressAutocompleteInput
  const handleLocationSelection = useCallback(
    (
      locationData: LocationData | null,
      locationStringFieldOnChange: (value: string) => void,
    ) => {
      if (locationData) {
        // Use displayName as the primary source for the input field's text
        const displayValue =
          locationData.displayName ||
          locationData.formattedAddress || // Fallback
          `${locationData.city}${
            locationData.country ? `, ${locationData.country}` : ""
          }`;

        locationStringFieldOnChange(displayValue);
        form.setValue("locationData", locationData, { shouldValidate: true });
      } else {
        locationStringFieldOnChange("");
        form.setValue("locationData", undefined, { shouldValidate: true });
      }
    },
    [form],
  );

  // MEMOIZED CALLBACK for DetectLocation
  const handleLocationDetected = useCallback(
    (locationData: LocationData) => {
      const displayValue =
        locationData.displayName ||
        locationData.formattedAddress ||
        `${locationData.city}${
          locationData.country ? `, ${locationData.country}` : ""
        }`;
      form.setValue("location", displayValue, { shouldValidate: true });
      form.setValue("locationData", locationData, { shouldValidate: true });
    },
    [form],
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Customize your FajrRing experience
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormField
                  control={form.control}
                  name="location" // This is the string field for display
                  render={({ field }) => (
                    <AddressAutocompleteInput
                      value={field.value} // Controlled by RHF 'location' field
                      onLocationSelect={(locData) =>
                        handleLocationSelection(locData, field.onChange)
                      }
                      label="Current Location"
                      placeholder="Enter your city, country"
                      disabled={isLoading}
                      className="md:col-span-1" // Ensure it takes full width on its own
                    />
                  )}
                />
                <div className="flex items-end md:col-span-1">
                  <DetectLocation
                    onLocationDetected={handleLocationDetected}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Timezone:</strong>{" "}
                  <span className={cn({ "opacity-0": isFetchingTimezone })}>
                    {timezoneInfo}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Calculation Method Card */}
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
              <FormField
                control={form.control}
                name="calculationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calculation Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select calculation method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {prayerCalculationMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {watchedCalculationMethod === "custom" && (
                <div className="bg-muted grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="customFajrAngle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fajr Angle</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="18.0"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customIshaAngle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Isha Angle</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="17.0"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Fajr Call Timing Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Clock className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Fajr Call Timing</CardTitle>
                  <CardDescription>
                    When should we call you before Fajr prayer? (
                    <span
                      className={cn({ "opacity-70": isFetchingPrayerTimings })}
                    >
                      {addMinutesToTimeString(
                        prayerTimings?.timings.Fajr ?? "",
                        form.watch("callOffset")[0]!,
                      )}
                    </span>
                    )
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="callOffset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Call me {field.value[0]} minutes{" "}
                      {field.value[0]! >= 0 ? "before" : "after"} Fajr
                    </FormLabel>
                    <FormControl>
                      <div>
                        <Slider
                          value={field.value}
                          onValueChange={field.onChange}
                          max={120}
                          min={-120}
                          step={5}
                          className="w-full"
                          disabled={isLoading}
                        />
                        <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                          <span>120 min before</span>
                          <span>At Fajr time</span>
                          <span>120 min after</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Phone Number Card */}
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
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-foreground font-medium">
                    {form.watch("phoneNumber")}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-600">Verified</p>
                  </div>
                </div>

                <Dialog>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleVerifyPhoneNumber();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Update Phone Number
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change phone number</DialogTitle>
                        <DialogDescription>
                          Make changes to your phone number here. Click save
                          when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="new-number">Name</Label>
                          <PhoneInput
                            id="new-number"
                            name="new-number"
                            international
                            defaultCountry="TR" // Based on the current phone number
                            defaultValue={form.getValues("phoneNumber")}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Send Verification</Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Account Management Card */}
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
                <Button type="button" variant="outline" disabled={isLoading}>
                  <User className="mr-2 h-4 w-4" />
                  Manage Profile
                </Button>
                <Button type="button" variant="outline" disabled={isLoading}>
                  <Shield className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              <div className="border-border border-t pt-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full md:w-auto"
                      disabled={isLoading}
                    >
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
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
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

          <div className="flex justify-end">
            <Button type="submit" size="lg" loading={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
