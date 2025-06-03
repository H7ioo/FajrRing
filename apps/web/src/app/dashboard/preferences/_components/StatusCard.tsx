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
import { Switch } from "@/components/ui/switch";
import { Phone } from "lucide-react";
import { useFormData } from "../page";

export function CallStatusCard() {
  const { form, isLoading } = useFormData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Phone className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle>Call Ring</CardTitle>
            <CardDescription>
              Enable or disable prayer call reminders
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="callsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">
                  Receive Prayer Calls
                </FormLabel>
                <div className="text-muted-foreground text-sm">
                  {field.value
                    ? "You will receive calls for prayer times"
                    : "Prayer calls are currently disabled"}
                </div>
              </div>
              <FormControl>
                <Switch
                  disabled={isLoading}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("callsEnabled") && (
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Active
              </span>
            </div>
            <p className="mt-1 text-sm text-green-600 dark:text-green-300">
              You will receive automated calls for your prayer times
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
