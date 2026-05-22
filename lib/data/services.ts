import {
  BarChart3,
  LineChart,
  Brain,
  ShieldCheck,
  Cloud,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface ServiceBase {
  slug: string;
  icon: LucideIcon;
  accent: "primary" | "accent";
  href: string;
}

export const serviceSlugs = [
  "data-analysis",
  "business-intelligence",
  "machine-learning",
  "data-auditing",
  "digital-transformation",
  "process-automation",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export const services: ServiceBase[] = [
  {
    slug: "data-analysis",
    icon: BarChart3,
    accent: "primary",
    href: "/services/data-analysis",
  },
  {
    slug: "business-intelligence",
    icon: LineChart,
    accent: "primary",
    href: "/services/business-intelligence",
  },
  {
    slug: "machine-learning",
    icon: Brain,
    accent: "primary",
    href: "/services/machine-learning",
  },
  {
    slug: "data-auditing",
    icon: ShieldCheck,
    accent: "accent",
    href: "/services/data-auditing",
  },
  {
    slug: "digital-transformation",
    icon: Cloud,
    accent: "accent",
    href: "/services/digital-transformation",
  },
  {
    slug: "process-automation",
    icon: Workflow,
    accent: "accent",
    href: "/services/process-automation",
  },
];

export function getServiceBySlug(slug: string): ServiceBase | undefined {
  return services.find((s) => s.slug === slug);
}
