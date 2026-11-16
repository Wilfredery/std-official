interface ServiceOverviewProps {
  label: string;
  overview: string;
  details?: string[];
}

export function ServiceOverview({
  label,
  overview,
  details = [],
}: ServiceOverviewProps) {
  return (
    <section className="mb-16 ">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
        {label}
      </h2>
      <p className="text-lg leading-relaxed">{overview}</p>
      {details.length > 0 && (
        <div className="mt-6 space-y-4">
          {details.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
