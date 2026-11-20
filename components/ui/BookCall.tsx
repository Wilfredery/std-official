import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { BOOKING_URL } from "@/lib/site";

/** Opens the Calendly booking page in a new tab. */
export function BookingButton({ label, newTabLabel }: { label: string; newTabLabel: string }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground
        px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover-glow
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
      {label}
      {/* Visible label stays the accessible name (WCAG 2.5.3); note the new tab. */}
      <span className="sr-only"> {newTabLabel}</span>
    </a>
  );
}

/** Secondary action: the contact page (WhatsApp, email, booking). */
export function ContactButton({ label }: { label: string }) {
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

interface BookCallCtaProps {
  title: string;
  text: string;
  bookingLabel: string;
  contactLabel: string;
  newTabLabel: string;
  className?: string;
}

/** Closing call-to-action card: book a call or go to the contact page. */
export function BookCallCta({
  title,
  text,
  bookingLabel,
  contactLabel,
  newTabLabel,
  className = "mt-16",
}: BookCallCtaProps) {
  return (
    <aside
      className={`relative rounded-2xl overflow-hidden gradient-border-card p-8 sm:p-10 text-center ${className}`}
    >
      <div className="absolute inset-0 hero-glow -z-[1] opacity-50" />
      <p className="text-2xl font-extrabold tracking-tight">{title}</p>
      <p className="mt-3 mb-8 text-muted-foreground">{text}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <BookingButton label={bookingLabel} newTabLabel={newTabLabel} />
        <ContactButton label={contactLabel} />
      </div>
    </aside>
  );
}
