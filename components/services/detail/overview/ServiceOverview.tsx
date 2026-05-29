interface ServiceOverviewProps {
  label: string;
  overview: string;
}

export function ServiceOverview({ label, overview }: ServiceOverviewProps) {
  return (
    <section className="mb-16 ">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
        {label}
      </h2>
      <p className="text-lg leading-relaxed">{overview}</p>
    </section>
  );
}
