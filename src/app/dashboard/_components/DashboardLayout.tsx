export function DashboardLayout({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-foreground text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {children}
    </div>
  );
}
