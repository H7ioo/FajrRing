import { api } from "@/trpc/react";
import { toast } from "sonner";

export function usePreferences() {
  const savePreferencesMutation = api.preference.save.useMutation({
    onSuccess(data, variables, context) {
      toast.success("preferences saved successfully", {
        description: "Your prayer call preferences have been updated",
      });
    },
    onError(error) {
      toast.error("Failed to save preferences", {
        description: error.message,
      });
    },
  });

  return {
    savePreferencesMutation,
  };
}
