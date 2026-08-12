import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";
import { imageAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Surjay Design & Print collects, uses and protects the personal information submitted through this website.",
  path: "/privacy"
});

const LAST_UPDATED = "24 July 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-heading text-2xl font-semibold text-navy">{title}</h2>
      <div className="mt-3 space-y-4 leading-8 text-charcoal/75">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" }
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        body="How we handle the information you share with us through this website."
        image={imageAssets.rawBales}
      />
      <Breadcrumbs items={[{ name: "Privacy Policy", href: "/privacy" }]} />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <p className="text-sm text-charcoal/60">Last updated: {LAST_UPDATED}</p>

        <Section title="Who we are">
          <p>
            This website is operated by <strong>{site.legalName}</strong>, trading as{" "}
            {site.name}, a proprietorship firm registered in Rajasthan, India.
          </p>
          <p>
            Factory address: {site.address.full}
            <br />
            Email: <a className="text-magenta underline" href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            Phone: <a className="text-magenta underline" href={`tel:${site.phoneHref}`}>{site.phone}</a>
            <br />
            GSTIN: {site.registrations.gstin}
          </p>
        </Section>

        <Section title="What information we collect">
          <p>We only collect information you choose to submit through this website:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Enquiry and quote forms</strong> — your name, company name, phone number,
              email address, the service you are interested in, and your message or requirement.
            </li>
            <li>
              <strong>Newsletter</strong> — your email address only.
            </li>
            <li>
              <strong>Technical data</strong> — our hosting provider records standard server logs
              (such as IP address and browser type) for security and to prevent form spam.
            </li>
          </ul>
          <p>
            We do <strong>not</strong> ask for or collect payment details, identity documents or
            any sensitive personal data through this website.
          </p>
        </Section>

        <Section title="Why we use it">
          <p>
            Solely to respond to your business enquiry, prepare quotations, fulfil orders, and — if
            you subscribed — to send occasional updates about our products and capabilities. We do
            not use your information for automated decision-making or profiling.
          </p>
        </Section>

        <Section title="Your consent">
          <p>
            By submitting a form on this website you consent to us using the information you provide
            for the purposes described above. Providing your details is voluntary, but we cannot
            respond to an enquiry without at least a name and a way to contact you.
          </p>
          <p>
            You can withdraw your consent at any time by emailing us — see{" "}
            <em>Your rights</em> below.
          </p>
        </Section>

        <Section title="Who we share it with">
          <p>
            We do <strong>not</strong> sell, rent or trade your personal information. It is shared
            only with service providers that operate this website on our behalf:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Our website host</strong> — serves the website and keeps standard server logs.
            </li>
            <li>
              <strong>Our form-delivery provider</strong> — passes your form submission to our email
              inbox. It processes the message only to deliver it.
            </li>
          </ul>
          <p>
            We may also disclose information where we are required to do so by law or by a competent
            authority.
          </p>
        </Section>

        <Section title="Where your information is stored">
          <p>
            Our hosting and form-delivery providers may process and store data on servers located
            outside India. Where that happens, we rely on the provider&apos;s contractual safeguards
            to protect your information to a comparable standard.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Business enquiries are retained for as long as needed to serve you and to meet our legal,
            tax and accounting obligations. Newsletter subscriptions are kept until you unsubscribe.
            You may ask us to delete your information sooner at any time.
          </p>
        </Section>

        <Section title="How we protect it">
          <p>
            The website is served over an encrypted (HTTPS) connection, form submissions are
            transmitted securely, and access to enquiry emails is limited to authorised personnel.
            No method of transmission over the internet is completely secure, but we take reasonable
            measures to protect your information against loss, misuse and unauthorised access.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            This website does not use advertising or tracking cookies, and we do not run third-party
            analytics or advertising pixels. The embedded Google Map on our contact page is provided
            by Google and may set its own cookies when it loads — please see Google&apos;s privacy
            policy for details.
          </p>
        </Section>

        <Section title="Children">
          <p>
            This is a business-to-business website and is not directed at children. We do not
            knowingly collect personal information from anyone under 18.
          </p>
        </Section>

        <Section title="Your rights">
          <p>
            Subject to applicable law — including India&apos;s Digital Personal Data Protection Act,
            2023, and the GDPR where it applies to you — you may ask us to:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>confirm what personal information we hold about you and obtain a copy;</li>
            <li>correct information that is inaccurate or incomplete;</li>
            <li>erase your information where we no longer need it;</li>
            <li>withdraw your consent or unsubscribe from our updates;</li>
            <li>raise a grievance about how your information has been handled.</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a className="text-magenta underline" href={`mailto:${site.email}`}>{site.email}</a>{" "}
            with your request. We will respond within a reasonable period.
          </p>
        </Section>

        <Section title="Grievance contact">
          <p>
            For any question or complaint about this policy or your personal information, please
            contact <strong>{site.proprietor}</strong>, Proprietor, {site.name}, at{" "}
            <a className="text-magenta underline" href={`mailto:${site.email}`}>{site.email}</a> or{" "}
            <a className="text-magenta underline" href={`tel:${site.phoneHref}`}>{site.phone}</a>.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. Any changes will be published on this page
            with a revised &ldquo;last updated&rdquo; date.
          </p>
        </Section>
      </div>
    </>
  );
}
