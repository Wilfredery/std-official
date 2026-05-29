import { getTranslations } from "next-intl/server";
import { ServiceBase } from "@/lib/data/services";
import { ServiceHero } from "./hero/ServiceHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceBreadcrumb } from "./breadcrumb/ServiceBreadcrumb";
import { ServiceOverview } from "./overview/ServiceOverview";
import { ServiceAudience } from "./audience/ServiceAudience";
import { ServiceDeliverables } from "./deliverables/ServiceDeliverables";
import { ServiceTimeline } from "./timeline/ServiceTimeline";
import { ServiceFaq } from "./faq/ServiceFaq";
import { CtaLink } from "./ctaLink/CtaLink";

interface ServiceDetailData {
  overview: string;
  forWho: string;
  problem: string;
  deliverables: string[];
  outcomes: { metric: string; label: string }[];
  timeline: { step: string; title: string; description: string }[];
  faq: { question: string; answer: string }[];
}

interface ServiceDetailLabels {
  breadcrumb: string;
  summaryLabel: string;
  forWhoLabel: string;
  problemLabel: string;
  deliverables: string;
  outcomes: string;
  timeline: string;
  faq: string;
  back: string;
}

interface ServiceDetailSectionProps {
  service: ServiceBase;
  locale: string;
  slug: string;
}

export async function ServiceDetailSection({
  service,
  locale,
  slug,
}: ServiceDetailSectionProps) {
  const labelsT = await getTranslations({ locale, namespace: "serviceDetail" });
  const serviceT = await getTranslations({
    locale,
    namespace: `serviceDetail.services.${slug}`,
  });

  const labels: ServiceDetailLabels = {
    breadcrumb: labelsT("breadcrumb"),
    summaryLabel: labelsT("summaryLabel"),
    forWhoLabel: labelsT("forWhoLabel"),
    problemLabel: labelsT("problemLabel"),
    deliverables: labelsT("deliverables"),
    outcomes: labelsT("outcomes"),
    timeline: labelsT("timeline"),
    faq: labelsT("faq"),
    back: labelsT("back"),
  };

  const data: ServiceDetailData = {
    overview: serviceT("overview"),
    forWho: serviceT("forWho"),
    problem: serviceT("problem"),
    deliverables: serviceT.raw("deliverables") as string[],
    outcomes: serviceT.raw("outcomes") as { metric: string; label: string }[],
    timeline: serviceT.raw("timeline") as {
      step: string;
      title: string;
      description: string;
    }[],
    faq: serviceT.raw("faq") as { question: string; answer: string }[],
  };

  return (
    <>
      <ScrollReveal direction="up" delay={0}>
        <ServiceHero
          title={serviceT("title")}
          subtitleStatic={serviceT("subtitleStatic")}
          subtitleDynamic={serviceT("subtitleDynamic")}
        />
      </ScrollReveal>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <ScrollReveal direction="scale" delay={0}>
          <ServiceBreadcrumb label={labels.breadcrumb} />
        </ScrollReveal>

        <ScrollReveal direction="left" delay={100}>
          <ServiceOverview
            label={labels.summaryLabel}
            overview={data.overview}
          />
        </ScrollReveal>

        <ScrollReveal direction="down" delay={200}>
          <ServiceAudience
            forWhoLabel={labels.forWhoLabel}
            forWho={data.forWho}
            problemLabel={labels.problemLabel}
            problem={data.problem}
          />
        </ScrollReveal>

        <ScrollReveal direction="right" delay={300}>
          <ServiceDeliverables
            title={labels.deliverables}
            items={data.deliverables}
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={400}>
          <ServiceTimeline
            title={labels.timeline}
            steps={data.timeline}
            accent={service.accent}
            slug={service.slug}
          />
        </ScrollReveal>

        <ScrollReveal direction="down" delay={500}>
          <ServiceFaq title={labels.faq} items={data.faq} />
        </ScrollReveal>

        <ScrollReveal direction="scale" delay={600}>
          <CtaLink label={labels.back} />
        </ScrollReveal>
      </article>
    </>
  );
}
