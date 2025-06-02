"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { usePreferences } from "@/hooks/use-preferences";
import { PrayerCalculationMethodEnum } from "@/lib/aladhan";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { createContext, useContext, useState, type Context } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DashboardLayout } from "../_components/DashboardLayout";
import { CalculationMethodCard } from "./_components/CalculationMethodCard";
import { FajrCallTimingCard } from "./_components/FajrCallTimingCard";
import { LocationCard } from "./_components/LocationCard";

const preferencesSchema = z.object({
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
  customFajrAngle: z.string().optional(),
  customIshaAngle: z.string().optional(),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

export type FormContextType = {
  form: UseFormReturn<PreferencesFormData>;
  isLoading: boolean;
};

const FormContext = createContext<FormContextType | null>(null);

export function useFormData() {
  return useContext(FormContext as Context<FormContextType>);
}

export default function PreferencesPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {} = usePreferences();

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      location: "",
      locationData: undefined,
      calculationMethod: undefined,
      callOffset: [0],
      customFajrAngle: "",
      customIshaAngle: "",
    },
  });

  const onSubmit = async (data: PreferencesFormData) => {
    setIsLoading(true);
    console.log("Form data:", data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("preferences saved successfully", {
      description: "Your prayer call preferences have been updated",
    });
  };

  return (
    <FormContext.Provider value={{ form, isLoading }}>
      <DashboardLayout
        title="Preferences"
        description="Customize your FajrRing experience"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Location Card */}
            <LocationCard />

            {/* Prayer Calculation Method Card */}
            <CalculationMethodCard />

            {/* Fajr Call Timing Card */}
            <FajrCallTimingCard />

            <div className="flex justify-end">
              <Button type="submit" size="lg" loading={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save preferences
              </Button>
            </div>
          </form>
        </Form>
      </DashboardLayout>
    </FormContext.Provider>
  );
}
