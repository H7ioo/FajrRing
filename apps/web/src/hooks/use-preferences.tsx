import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";
import { toast } from "sonner";

export function usePreferences() {
  const savePreferencesMutation = api.preference.save.useMutation({
    onSuccess(data, variables, context) {
      toast.success("preferences saved successfully", {
        description: "Your prayer call preferences have been updated",
      });
    },
    onError(error, variables) {
      if (!error.data?.metaError) {
        toast.error("Failed to save preferences. Please try again...", {});
        return;
      }

      // TODO: Complete the take actions
      // TODO: What you need to do is to create a mutation and pass it to the component and look for isLoading to have a loading spinner and errors handling
      const retryFunctions = {
        removeCallSchedule: () => {
          //  removeCallScheduleMutation.mutate();
        },
        scheduleCall: () => {
          //  scheduleCallMutation.mutate();
        },
        savePreferences: () => {
          savePreferencesMutation.mutate(variables);
        },
      };

      const { toast: toastMeta } = error.data.metaError;
      const { action } = toastMeta;
      switch (action.type) {
        case "redirect":
          toast.error("Failed to save preferences", {
            description: error.message,
            action: (
              <Button asChild className="dark">
                <Link href={action.url}>{action.label ?? "Go"}</Link>
              </Button>
            ),
          });
          break;
        case "retry":
          toast.error("Failed to save preferences", {
            description: error.message,
            duration: 8000,
            action: (
              <Button
                asChild
                className="dark"
                onClick={() => {
                  retryFunctions[action.retryFn]();
                }}
              >
                Retry again
              </Button>
            ),
          });
          break;
        default:
          toast.error("Failed to save preferences. Please try again...", {});
      }
    },
  });

  return {
    savePreferencesMutation,
  };
}
