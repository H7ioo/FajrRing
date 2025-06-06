// TODO: Tailor
// @see https://t3.chat/chat/43b265ff-226c-4b01-a1cd-bef14bf6a102
export type ToastAction =
  | { type: "simple" }
  | {
      type: "retry";
      retryFn: string;
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
