// TODO: Tailor
// @see https://t3.chat/chat/43b265ff-226c-4b01-a1cd-bef14bf6a102
// I have two options
// 1. Following zod way by creating an error inside of the error itself (I choose this since it is more suitable with TRPC implementation)
// 2. Passing meta data to cause and type casting it in the error handler
export type ToastAction =
  | { type: "simple" }
  | {
      type: "retry";
      retryFn: "savePreferences" | "scheduleCall" | "removeCallSchedule";
      retryParams?: Record<string, unknown>;
    }
  | {
      type: "redirect";
      url: string;
      label?: string;
    }
  | {
      type: "custom";
      component: string;
      props?: Record<string, unknown>;
    };

export interface ErrorMeta {
  toast: {
    action: ToastAction;
    duration?: number;
    severity?: "error" | "warning" | "info";
    dismissible?: boolean;
  };
}

export class TRPCErrorWithAction extends Error {
  public meta: ErrorMeta;

  constructor(message: string, meta: ErrorMeta) {
    super(message);
    this.name = "TRPCErrorWithMeta";
    this.meta = meta;
  }
}
