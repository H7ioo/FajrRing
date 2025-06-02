import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { addMinutesToTimeString } from "@/lib/timezone";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Clock } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useFormData } from "../page";

export function FajrCallTimingCard() {
  const { form, isLoading } = useFormData();

  const watchedLocationData = useWatch({
    control: form.control,
    name: "locationData",
  });

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

  return (
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
                className={cn({
                  "opacity-70": isFetchingPrayerTimings,
                })}
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
  );
}
