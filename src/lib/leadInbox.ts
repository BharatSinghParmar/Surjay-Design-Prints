import "server-only";

/**
 * Where website form submissions are actually delivered.
 *
 * Deliberately NOT in src/data/site.ts: that module is imported by client
 * components, so anything in it ships to the browser and gets scraped by spam
 * crawlers. This module is server-only and can never reach the client bundle.
 *
 * Override per-environment with LEAD_INBOX.
 *
 * The default is the company's own address on purpose: an enquiry is the whole
 * point of the site, and a missing environment variable must never silently
 * route one somewhere else.
 */
export const LEAD_INBOX = process.env.LEAD_INBOX || "surjaydesign@gmail.com";
