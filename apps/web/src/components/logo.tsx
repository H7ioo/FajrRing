import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const logoVariants = cva(
  "font-bold text-primary transition-colors select-none",
  {
    variants: {
      size: {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl xl:text-3xl",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

const taglineVariants = cva(
  "text-muted-foreground font-normal transition-colors",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface LogoProps extends VariantProps<typeof logoVariants> {
  showTagline?: boolean;
  tagline?: string;
  className?: string;
}

export function Logo({
  size = "md",
  variant = "default",
  showTagline = false,
  tagline = "Your Islamic companion",
  className,
}: LogoProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className={logoVariants({ size, variant })}>FajrRing</div>
      {showTagline && (
        <div className={taglineVariants({ size })}>{tagline}</div>
      )}
    </div>
  );
}
