import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, site } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Surjay Design & Prints for fabric dyeing, screen printing, hand printing, textile finishing and bulk fabric manufacturing inquiries.",
  path: "/contact"
});

const contactItems = [
  { icon: Phone, title: "Phone", value: site.phone, href: `tel:${site.phone}` },
  { icon: Mail, title: "Email", value: site.email, href: `mailto:${site.mailTo}` },
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

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Rajasthan, India"
              title="Connect with Surjay Design & Prints."
              body="The company supplies wholesalers, garment manufacturers, textile traders and bulk buyers with dyeing, printing and finishing support."
            />
            <div className="mt-8 grid gap-4">
              <Reveal className="rounded-lg border border-slate-200 bg-mist p-6">
                <MapPin className="h-6 w-6 text-magenta" />
                <h2 className="mt-4 font-heading text-xl font-semibold text-navy">Google Map Placeholder</h2>
                <p className="mt-2 text-sm leading-7 text-charcoal/70">
                  Rajasthan, India. Add the verified Google Maps embed once the public listing is ready.
                </p>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {contactItems.map((item) => (
                  <Reveal key={item.title} className="rounded-lg border border-slate-200 p-5">
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
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
