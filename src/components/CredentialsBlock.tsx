import { BadgeCheck, Building2, MapPin, Users } from "lucide-react";
import { site } from "@/data/site";

/**
 * Verifiable business credentials. Indian B2B buyers routinely check GST and
 * Udyam numbers before placing a bulk order, so these are shown plainly rather
 * than buried in a footer.
 */
const items = [
  {
    icon: BadgeCheck,
    label: "GST Identification Number",
    value: site.registrations.gstin,
    note: "Verifiable on the GST portal"
  },
  {
    icon: Building2,
    label: "Udyam Registration (MSME)",
    value: site.registrations.udyam,
    note: "Ministry of MSME, Government of India"
  },
  {
    icon: Users,
    label: "Team Size",
    value: `${site.employees} people`,
    note: "Skilled dyeing, printing & finishing staff"
  },
  {
    icon: MapPin,
    label: "Factory",
    value: `${site.address.locality}, ${site.address.city}`,
    note: "RIICO Industrial Area, Rajasthan"
  }
];

export function CredentialsBlock() {
  return (
    <section className="border-y border-slate-200 bg-mist py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">
            Registered &amp; Verifiable
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">
            A registered manufacturer you can verify.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-charcoal/72">
            {site.name} is a proprietorship firm led by {site.proprietor}, operating a
            GST-registered, MSME-recognised textile manufacturing unit in Rajasthan —{" "}
            <strong className="font-semibold text-navy">
              {new Date().getFullYear() - site.experienceSince}+ years of experience since{" "}
              {site.experienceSince}, registered {site.registeredYear}.
            </strong>
          </p>
        </div>

        {/* Both addresses — works and registered office */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-magenta" />
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
                Factory / Works
              </p>
            </div>
            <address className="mt-3 not-italic leading-7 text-charcoal/80">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.locality}, {site.address.city}, {site.address.region}{" "}
              {site.address.postalCode}
            </address>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-magenta underline"
            >
              View on Google Maps
            </a>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-magenta" />
              <p className="text-xs font-bold uppercase tracking-wider text-charcoal/70">
                Registered Office
              </p>
            </div>
            <address className="mt-3 not-italic leading-7 text-charcoal/80">
              {site.registeredOffice.line1}
              <br />
              {site.registeredOffice.line2}
              <br />
              {site.registeredOffice.city}, {site.registeredOffice.region}{" "}
              {site.registeredOffice.postalCode}
            </address>
            <p className="mt-3 text-xs leading-5 text-charcoal/60">
              As recorded on our GST and Udyam registrations.
            </p>
          </div>
        </div>

        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <Icon className="h-6 w-6 text-magenta" />
                <dt className="mt-4 text-xs font-bold uppercase tracking-wider text-charcoal/70">
                  {item.label}
                </dt>
                <dd className="mt-2 break-words font-heading text-lg font-semibold text-navy">
                  {item.value}
                </dd>
                <p className="mt-1 text-xs leading-5 text-charcoal/64">{item.note}</p>
              </div>
            );
          })}
        </dl>

        {site.visitorsWelcome && (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-xl bg-navy px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-heading text-lg font-semibold text-white">
                Buyers are welcome to visit our factory.
              </p>
              <p className="mt-1 text-sm text-white/70">
                See the dyeing, printing and finishing lines in person — {site.hoursShort}. Please
                call ahead so we can host you properly.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex min-h-12 flex-none items-center justify-center rounded-lg bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Arrange a Visit
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
