import { Building2, Clock, ExternalLink, MapPin, Navigation } from "lucide-react";
import { site } from "@/data/site";

/**
 * Factory location map for the contact page.
 *
 * Uses Google's keyless embed endpoint (no API key, no billing account) and is
 * lazy-loaded so it never competes with the initial page render. Both buttons
 * deep-link to the real Google Maps listing, which opens the Maps app on mobile.
 */
const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.address.full
)}&z=15&output=embed`;

export function FactoryMap() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium">
      {/* Map */}
      <div className="relative aspect-[16/10] w-full bg-mist sm:aspect-[16/9]">
        <iframe
          src={embedSrc}
          title={`Map showing ${site.name} factory at ${site.address.locality}, ${site.address.city}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      {/* Details */}
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-magenta">Factory Location</p>

        <div className="mt-4 flex gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-none text-magenta" />
          <address className="not-italic leading-7 text-charcoal/80">
            <span className="font-semibold text-navy">{site.name}</span>
            <br />
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            {site.address.locality}, {site.address.city}, {site.address.region}{" "}
            {site.address.postalCode}
            <br />
            India
          </address>
        </div>

        <div className="mt-4 flex gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-none text-magenta" />
          <p className="leading-7 text-charcoal/80">{site.hours}</p>
        </div>

        {site.visitorsWelcome && (
          <p className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Buyers are welcome to visit the factory — please call ahead to arrange a time.
          </p>
        )}

        {/* Registered office (as per GST / Udyam) */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-mist p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-magenta" />
            <p className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
              Registered Office
            </p>
          </div>
          <address className="mt-2 not-italic text-sm leading-6 text-charcoal/75">
            {site.registeredOffice.line1}, {site.registeredOffice.line2}
            <br />
            {site.registeredOffice.city}, {site.registeredOffice.region}{" "}
            {site.registeredOffice.postalCode}
          </address>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-magenta px-5 py-3 text-sm font-semibold text-white transition hover:bg-wine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-navy transition hover:border-magenta hover:text-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
