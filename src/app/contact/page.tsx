import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { FactoryMap } from "@/components/FactoryMap";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PrintBackdrop } from "@/components/PrintBackdrop";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ResourceCard } from "@/components/ResourceCard";
import { faqs } from "@/data/faqs";
import { companyResources } from "@/data/resources";
import { imageAssets, site } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Surjay Design & Print for fabric dyeing, screen printing, hand printing, textile finishing and bulk fabric manufacturing inquiries.",
  path: "/contact",
  keywords: [
    "textile company in jaipur",
    "textile manufacturers in jaipur",
    "jaipur cloth manufacturer",
    "textile companies in rajasthan",
    "dyeing and printing"
  ]
});

const contactItems = [
  { icon: Phone, title: "Phone", value: site.phone, href: `tel:${site.phoneHref}` },
  { icon: Mail, title: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: MessageCircle, title: "WhatsApp", value: "Message on WhatsApp", href: `https://wa.me/${site.whatsapp}` },
  { icon: Clock, title: "Business Hours", value: site.hours, href: null }
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" }
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title="Send your fabric requirement."
        body="Share your fabric type, process need, quantity and dispatch timeline for a manufacturing conversation."
        image={imageAssets.hero}
      />
      <Breadcrumbs items={[{ name: "Contact", href: "/contact" }]} />

      {/* Reach-us cards run full width above the fold, so the form and the map
          sit side by side as two comparable columns below — the form no longer
          trails past a stack of details after "Submit Inquiry". */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Rajasthan, India"
            title="Connect with Surjay Design & Print."
            body="The company supplies wholesalers, garment manufacturers, textile traders and bulk buyers with dyeing, printing and finishing support."
            align="center"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map((item) => (
              <Reveal key={item.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <item.icon className="h-6 w-6 text-magenta" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-navy">{item.title}</h3>
                {item.href ? (
                  <a className="mt-2 block text-sm text-charcoal/72 hover:text-magenta" href={item.href}>
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-charcoal/72">{item.value}</p>
                )}
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
            <ContactForm />
            <Reveal>
              <FactoryMap />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── RESOURCE CENTER ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-mist py-20 md:py-28">
        <PrintBackdrop tone="light" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Company Profile"
            title="Need more information before reaching out?"
            body="Download our complete corporate profile to review our capabilities, infrastructure, and process standards offline."
            align="center"
          />
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-4xl">
              <ResourceCard document={companyResources[0]} />
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        items={faqs.contact}
        title="Before you get in touch"
        body="Where we are, who we are registered as, and what to include in a quote request."
        path="/contact"
        surface="white"
      />
    </>
  );
}
