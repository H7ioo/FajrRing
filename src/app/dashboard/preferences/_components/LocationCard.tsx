import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { MapPin } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";
import {
  AddressAutocompleteInput,
  type LocationData,
} from "../../../../components/address-autocomplete-input";
import { DetectLocation } from "../../../../components/detect-location";
import { useFormData } from "../page";

export function LocationCard() {
  const { form, isLoading } = useFormData();

  const watchedTimezone = useWatch({
    control: form.control,
    name: "locationData.timezone",
  });

  const timezoneInfo = useMemo(() => {
    if (
      watchedTimezone?.rawOffset !== undefined &&
      watchedTimezone?.dstOffset !== undefined &&
      watchedTimezone?.timezoneName
    ) {
      const offset =
        (watchedTimezone.rawOffset + watchedTimezone.dstOffset) / 3600;
      const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
      return `GMT${offsetString} (${watchedTimezone.timezoneName})`;
    } else {
      const now = new Date();
      const offset = -now.getTimezoneOffset() / 60;
      const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
      return `GMT${offsetString} (Local Time)`;
    }
  }, [watchedTimezone]);

  // TODO: We could do a re-write
  const handleLocationChange = useCallback(
    (location: string, locationData?: LocationData) => {
      form.setValue("location", location, { shouldValidate: true });
      form.setValue("locationData", locationData, { shouldValidate: true });
    },
    [form],
  );

  const handleLocationSelection = useCallback(
    (
      locationData: LocationData | null,
      locationStringFieldOnChange: (value: string) => void,
    ) => {
      if (locationData) {
        const displayValue =
          locationData.displayName ||
          locationData.formattedAddress ||
          `${locationData.city}${
            locationData.country ? `, ${locationData.country}` : ""
          }`;

        locationStringFieldOnChange(displayValue);
        form.setValue("locationData", locationData, { shouldValidate: true });
        handleLocationChange?.(displayValue, locationData);
      } else {
        locationStringFieldOnChange("");
        form.setValue("locationData", undefined, { shouldValidate: true });
        handleLocationChange?.("", undefined);
      }
    },
    [form, handleLocationChange],
  );

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
      handleLocationChange?.(displayValue, locationData);
    },
    [form, handleLocationChange],
  );

  return (
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
            name="location"
            render={({ field }) => (
              <AddressAutocompleteInput
                value={field.value}
                onLocationSelect={(locData) =>
                  handleLocationSelection(locData, field.onChange)
                }
                label="Current Location"
                placeholder="Enter your city, country"
                disabled={isLoading}
                className="md:col-span-1"
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
            <strong>Timezone:</strong> <span>{timezoneInfo}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
