interface ServiceAudienceProps {
  forWhoLabel: string;
  forWho: string;
  problemLabel: string;
  problem: string;
}

export function ServiceAudience({
  forWhoLabel,
  forWho,
  problemLabel,
  problem,
}: ServiceAudienceProps) {
  return (
    <section className="grid md:grid-cols-2 gap-8 mb-16 ">
      <div className="gradient-border-card p-6 rounded-2xl glow-gradient">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
          {forWhoLabel}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{forWho}</p>
      </div>

      <div className="gradient-border-card p-6 rounded-2xl glow-gradient">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
          {problemLabel}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{problem}</p>
      </div>
    </section>
  );
}
