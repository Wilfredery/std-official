import { getTranslations } from "next-intl/server";
import { ServiceBase } from "@/lib/data/services";
import { ServiceBreadcrumb } from "./breadcrumb/ServiceBreadcrumb";
import { ServiceHero } from "./hero/ServiceHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ServiceOverview } from "./overview/ServiceOverview";
import { ServiceAudience } from "./audience/ServiceAudience";
import { ServiceDeliverables } from "./deliverables/ServiceDeliverables";
import { ServiceTools } from "./tools/ServiceTools";
import { ServiceTimeline } from "./timeline/ServiceTimeline";
import { ServiceFaq } from "./faq/ServiceFaq";
import { CtaLink } from "./ctaLink/CtaLink";
import { BookCallCta } from "@/components/ui/BookCall";

interface ServiceDetailData {
  overview: string;
  details: string[];
  forWho: string;
  problem: string;
  deliverables: string[];
  tools: { name: string; description: string }[];
  timeline: { step: string; title: string; description: string }[];
  faq: { question: string; answer: string }[];
}

interface ServiceDetailLabels {
  breadcrumb: string;
  summaryLabel: string;
  forWhoLabel: string;
  problemLabel: string;
  deliverables: string;
  toolsLabel: string;
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
  const contactT = await getTranslations({ locale, namespace: "contact.channels" });
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
    toolsLabel: labelsT("toolsLabel"),
    timeline: labelsT("timeline"),
    faq: labelsT("faq"),
    back: labelsT("back"),
  };

  const data: ServiceDetailData = {
    overview: serviceT("overview"),
    details: serviceT.raw("details") as string[],
    forWho: serviceT("forWho"),
    problem: serviceT("problem"),
    deliverables: serviceT.raw("deliverables") as string[],
    tools: serviceT.raw("tools") as { name: string; description: string }[],
    timeline: serviceT.raw("timeline") as {
      step: string;
      title: string;
      description: string;
    }[],
    faq: serviceT.raw("faq") as { question: string; answer: string }[],
  };

  // Same booking card after the delivery steps and after the FAQ, so readers
  // who are convinced at either point have a next step without scrolling back.
  const bookCall = (
    <BookCallCta
      title={labelsT("cta.title")}
      text={labelsT("cta.text")}
      bookingLabel={labelsT("cta.bookingLabel")}
      contactLabel={labelsT("cta.contactLabel")}
      newTabLabel={contactT("newTab")}
      className="my-16"
    />
  );

  return (
    <>
      <ServiceBreadcrumb label={labels.breadcrumb} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden pt-8 pb-6">
          <div className="absolute inset-0 -z-10" />

          {/* Above the fold: no ScrollReveal, so the LCP paints without waiting for hydration. */}
          <ServiceHero
            title={serviceT("title")}
            subtitleStatic={serviceT("subtitleStatic")}
            subtitleDynamic={serviceT("subtitleDynamic")}
          />
        </div>

        <ServiceOverview
          label={labels.summaryLabel}
          overview={data.overview}
          details={data.details}
        />

        <ScrollReveal direction="down">
          <ServiceAudience
            forWhoLabel={labels.forWhoLabel}
            forWho={data.forWho}
            problemLabel={labels.problemLabel}
            problem={data.problem}
          />
        </ScrollReveal>

        <ScrollReveal direction="right">
          <ServiceDeliverables
            title={labels.deliverables}
            items={data.deliverables}
          />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <ServiceTools title={labels.toolsLabel} items={data.tools} />
        </ScrollReveal>

        <ScrollReveal direction="up">
          <ServiceTimeline
            title={labels.timeline}
            steps={data.timeline}
            accent={service.accent}
            slug={service.slug}
          />
        </ScrollReveal>

        {bookCall}

        <ScrollReveal direction="down">
          <ServiceFaq title={labels.faq} items={data.faq} />
        </ScrollReveal>

        {bookCall}

        <ScrollReveal direction="scale">
          <CtaLink label={labels.back} />
        </ScrollReveal>
      </article>
    </>
  );
}
