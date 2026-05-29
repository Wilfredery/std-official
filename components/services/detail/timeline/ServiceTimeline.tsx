import {
  ClipboardList,
  FileSearch,
  BarChart3,
  Search,
  LayoutDashboard,
  Rocket,
  Brain,
  Cpu,
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

const timelineIcons: Record<string, LucideIcon[]> = {
  "data-analysis": [ClipboardList, FileSearch, BarChart3],
  "business-intelligence": [Search, LayoutDashboard, Rocket],
  "machine-learning": [Brain, Cpu, Rocket],
  "data-auditing": [Database, ShieldCheck, ClipboardCheck],
  "digital-transformation": [Search, PenTool, Cloud],
  "process-automation": [Workflow, Wrench, Zap],
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
    <section className="py-16 sm:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
            {title}
          </h2>
        </div>

        <div className="flex flex-col items-center sm:flex-row gap-8 max-w-4xl mx-auto relative">
          {/* Connecting line (desktop only) */}
          {steps.length > 1 && (
            <div
              className="hidden sm:block absolute top-10 h-px bg-border"
              style={{
                left: `${100 / (steps.length * 2)}%`,
                right: `${100 / (steps.length * 2)}%`,
              }}
            />
          )}

          {steps.map((step, i) => {
            const StepIcon = icons?.[i];

            return (
              <div
                key={i}
                className="flex flex-col items-center text-center relative flex-1"
              >
                <div
                  className={`size-20 rounded-full ${accentBg} grid place-items-center mb-4 relative z-10 border-4 border-background`}
                >
                  {StepIcon ? (
                    <StepIcon className={`size-8 ${accentText}`} />
                  ) : (
                    <span className={`text-xs font-mono ${accentText}`}>
                      {step.step}
                    </span>
                  )}
                </div>

                {/* Step label / number */}
                <span className="text-xs font-mono text-muted-foreground mb-2">
                  {String(i + 1).padStart(2, "0")} — {step.step}
                </span>

                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
