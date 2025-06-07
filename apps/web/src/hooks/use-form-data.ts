import type { PreferencesFormData } from "@/lib/validations/preference";
import type { UserSession } from "@/types";
import { createContext, useContext, type Context } from "react";
import type { UseFormReturn } from "react-hook-form";

export type FormContextType = {
  form: UseFormReturn<PreferencesFormData>;
  isLoading: boolean;
  user: UserSession | undefined;
};

export const FormContext = createContext<FormContextType | null>(null);

export function useFormData() {
  return useContext(FormContext as Context<FormContextType>);
}
