import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prayerCalculationMethods } from "@/lib/aladhan";
import { Calculator } from "lucide-react";
import { useFormData } from "../page";

export function CalculationMethodCard() {
  const { form, isLoading } = useFormData();

  return (
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
              <FormDescription>
                If not specified, it will be determined based on your location
              </FormDescription>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
                clearable
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    clearable
                    value={field.value}
                    onClear={() => field.onChange(undefined)}
                  >
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
  );
}
