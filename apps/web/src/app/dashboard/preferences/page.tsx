"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormContext } from "@/hooks/use-form-data";
import { usePreferences } from "@/hooks/use-preferences";
import {
  preferencesSchema,
  type PreferencesFormData,
} from "@/lib/validations/preference";
import { useSession } from "@/server/auth/auth-client";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../_components/DashboardLayout";
import { CalculationMethodCard } from "./_components/CalculationMethodCard";
import { FajrCallTimingCard } from "./_components/FajrCallTimingCard";
import { LocationCard } from "./_components/LocationCard";
import { CallStatusCard } from "./_components/StatusCard";

function PreferencesLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <div className="text-center">
        <h3 className="text-lg font-medium">Loading your preferences</h3>
        <p className="text-muted-foreground text-sm">
          Please wait while we fetch your settings...
        </p>
      </div>
    </div>
  );
}

export default function PreferencesPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, isPending: isSessionPending } = useSession();
  const user = session?.user;

  const { savePreferencesMutation } = usePreferences();
  const { mutate: savePreferences } = savePreferencesMutation;

  const { data: preferences, isLoading: isLoadingPreferences } =
    api.preference.get.useQuery();

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      location: "",
      locationData: undefined,
      calculationMethodId: undefined,
      fajrOffsetMinutes: [0],
      callsEnabled: true,
      // customFajrAngle: "",
      // customIshaAngle: "",
    },
  });

  const onSubmit = async (data: PreferencesFormData) => {
    setIsLoading(true);
    savePreferences(data, { onSettled: () => setIsLoading(false) });
  };

  useEffect(() => {
    if (preferences) {
      form.reset({
        location: preferences.location ?? "",
        // @ts-expect-error I want to set this to undefined
        calculationMethodId: preferences.calculationMethodId ?? undefined,
        fajrOffsetMinutes: [preferences.fajrOffsetMinutes ?? 0],
        callsEnabled: preferences.callsEnabled,
        locationData: {
          city: preferences.city ?? "",
          country: preferences.country ?? "",
          displayName: preferences.location ?? "",
          formattedAddress: preferences.formattedAddress ?? "",
          latitude: preferences.latitude ?? 0,
          longitude: preferences.longitude ?? 0,
          placeId: preferences.placeId ?? "",
          timezone: {
            dstOffset: preferences.dstOffset ?? 0,
            rawOffset: preferences.rawOffset ?? 0,
            timezoneId: preferences.timezoneId ?? "",
            timezoneName: preferences.timezoneName ?? "",
          },
        },
      });
    }
  }, [preferences]);

  return (
    <FormContext.Provider value={{ form, isLoading, user }}>
      <DashboardLayout
        title="Preferences"
        description="Customize your FajrRing experience"
      >
        {isLoadingPreferences || isSessionPending ? (
          <PreferencesLoading />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Location Card */}
              <LocationCard />

              {/* Prayer Calculation Method Card */}
              <CalculationMethodCard />

              {/* Fajr Call Timing Card */}
              <FajrCallTimingCard />

              {/* Status Card */}
              <CallStatusCard />

              <div className="flex justify-end">
                <Button type="submit" size="lg" loading={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save preferences
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DashboardLayout>
    </FormContext.Provider>
  );
}
