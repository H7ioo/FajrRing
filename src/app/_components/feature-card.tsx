import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgClass?: string;
  iconTextClass?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBgClass = "bg-muted",
  iconTextClass = "text-muted-foreground",
}: FeatureCardProps) {
  return (
    <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md">
      {/* Added flex for consistent height if needed */}
      <CardHeader className="items-center justify-center text-center">
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center justify-self-center rounded-full ${iconBgClass}`}
        >
          <Icon className={`h-8 w-8 ${iconTextClass}`} />
        </div>
        <CardTitle className="text-foreground text-xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        {/* flex-grow to push content down if cards have different text lengths */}
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
