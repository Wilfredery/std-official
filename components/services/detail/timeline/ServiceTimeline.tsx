import {
  ClipboardList,
  FileSearch,
  BarChart3,
  Search,
  LayoutDashboard,
  Rocket,
  Brain,
  Database,
  ShieldCheck,
  ClipboardCheck,
  PenTool,
  Cloud,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface TimelineStep {
  step: string;
  title: string;
  description: string;
}

interface ServiceTimelineProps {
  title: string;
  steps: TimelineStep[];
  accent: "primary" | "accent";
  slug: string;
}

// One icon per step (up to 5). Steps beyond the list fall back to the step label.
const timelineIcons: Record<string, LucideIcon[]> = {
  "data-analysis": [ClipboardList, Database, Wrench, BarChart3, Rocket],
  "business-intelligence": [
    Search,
    Database,
    LayoutDashboard,
    ShieldCheck,
    Rocket,
  ],
  "machine-learning": [ClipboardList, Database, Brain, Rocket, BarChart3],
  "data-auditing": [Database, FileSearch, Search, ShieldCheck, ClipboardCheck],
  "digital-transformation": [Search, PenTool, Wrench, Cloud, Rocket],
  "process-automation": [Workflow, PenTool, Wrench, Zap, Rocket],
};

export function ServiceTimeline({
  title,
  steps,
  accent,
  slug,
}: ServiceTimelineProps) {
  const accentBg = accent === "primary" ? "bg-primary/10" : "bg-accent/10";
  const accentText = accent === "primary" ? "text-primary" : "text-accent";

  const icons = timelineIcons[slug];

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-8">{title}</h2>

      <ol className="flex flex-col">
        {steps.map((step, i) => {
          const StepIcon = icons?.[i];
          const isLast = i === steps.length - 1;

          return (
            <li key={i} className="relative pl-20 pb-10 last:pb-0">
              {/* Connecting line between markers */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute left-7 top-14 bottom-0 w-px bg-border"
                />
              )}

              <div
                data-testid="timeline-marker"
                className={`absolute left-0 top-0 size-14 rounded-full ${accentBg} grid place-items-center border-4 border-background`}
              >
                {StepIcon ? (
                  <StepIcon
                    className={`size-6 ${accentText}`}
                    aria-hidden="true"
                  />
                ) : (
                  <span className={`text-xs font-mono ${accentText}`}>
                    {step.step}
                  </span>
                )}
              </div>

              {/* Step label / number */}
              <span className="block text-xs font-mono text-muted-foreground mb-1">
                {String(i + 1).padStart(2, "0")} — {step.step}
              </span>

              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
