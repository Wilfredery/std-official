import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { BOOKING_URL } from "@/lib/site";
import {
  landingUi,
  type Landing,
  type LandingBlock,
  type LandingInline,
} from "@/lib/data/landings";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";

const linkClass =
  "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors";

function Inline({ part }: { part: LandingInline }) {
  if (typeof part === "string") return <>{part}</>;
  return (
    <Link href={part.href} prefetch={false} className={linkClass}>
      {part.text}
    </Link>
  );
}

function Block({ block }: { block: LandingBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="pt-6 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul className="list-disc pl-6 space-y-3 marker:text-primary">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal pl-6 space-y-3 marker:font-semibold marker:text-primary">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "rich":
      return (
        <p>
          {block.parts.map((part, i) => (
            <Inline key={i} part={part} />
          ))}
        </p>
      );
    case "links":
      return (
        <nav aria-label={block.title} className="pt-6">
          <h2 className="text-lg font-bold text-foreground">{block.title}</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            {block.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={false}
                  className="inline-flex rounded-full border border-border px-4 py-2 hover:border-primary hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export function LandingPage({ landing }: { landing: Landing }) {
  return (
    <>
      <LandingJsonLd landing={landing} />

      <article className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <div className="absolute inset-x-0 top-0 h-72 hero-glow -z-10" />

        <nav aria-label={landingUi.breadcrumbAria} className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" prefetch={false} className="hover:text-primary transition-colors">
                {landingUi.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {landing.breadcrumbName}
            </li>
          </ol>
        </nav>

        <header className="mt-8 mb-10 space-y-5">
          <p className="text-sm font-medium text-primary">{landing.eyebrow}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {landing.h1}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {landing.intro}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <BookingButton label={landing.cta.bookingLabel} />
            <ContactButton label={landing.cta.contactLabel} />
          </div>
        </header>

        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-foreground/90">
          {landing.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <section className="mt-16" aria-labelledby="landing-faq">
          <h2 id="landing-faq" className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
            {landingUi.faqTitle}
          </h2>
          <div className="flex flex-col gap-4">
            {landing.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-border bg-card gradient-border-card hover-glow"
              >
                <summary
                  className="px-6 py-5 font-bold cursor-pointer list-none flex justify-between
                  items-center gap-4 text-base sm:text-lg focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-ring rounded-lg"
                >
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="text-primary group-open:rotate-45 transition-transform text-xl leading-none"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 text-base text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <aside className="relative mt-16 rounded-2xl overflow-hidden gradient-border-card p-8 sm:p-10 text-center">
          <div className="absolute inset-0 hero-glow -z-[1] opacity-50" />
          <p className="text-2xl font-extrabold tracking-tight">{landing.cta.title}</p>
          <p className="mt-3 mb-8 text-muted-foreground">{landing.cta.text}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <BookingButton label={landing.cta.bookingLabel} />
            <ContactButton label={landing.cta.contactLabel} />
          </div>
        </aside>
      </article>
    </>
  );
}

function BookingButton({ label }: { label: string }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={landingUi.bookingAria}
      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground
        px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover-glow
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </a>
  );
}

function ContactButton({ label }: { label: string }) {
  return (
    <Link
      href="/contact/"
      prefetch={false}
      className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3
        rounded-full font-semibold hover:border-primary hover:text-primary transition-colors
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {label}
      <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}
