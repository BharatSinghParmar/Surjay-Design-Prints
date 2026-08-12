/**
 * FAQ copy, grouped by the page that renders it.
 *
 * Keys match the route segment in camelCase. One group per page, and no
 * question is repeated between groups: near-identical Q&A across four URLs
 * reads as duplicate content and makes the pages compete with each other for
 * the same query instead of each owning one.
 *
 * House rules for answers, all of which matter:
 *  - Plain text only. No markdown, no HTML, no entities — write `&`, never
 *    `&amp;`, which would render as the literal five characters both in the
 *    page and in the JSON-LD.
 *  - 40-80 words. Long enough to actually answer, short enough to be quoted.
 *  - Answer in the first sentence. Search engines and LLM answer engines lift
 *    the opener; a paragraph that warms up before answering gets skipped.
 *  - Only claims that are already published elsewhere on this site. Every
 *    answer here is also emitted as structured data, so an unverifiable claim
 *    is asserted twice.
 *
 * Facts these answers draw on, and where they come from:
 *  - 3-5 working days end to end, plus per-stage durations — ManufacturingTimeline.tsx
 *  - 44-60 inch widths, 80-200 GSM, per-roll and flexible MOQ, sample runs — products/page.tsx
 *  - Stage descriptions — processSteps in site.ts
 *  - Address, hours, GSTIN, Udyam, 16+ years since 2010, registered 2011 — site.ts
 *
 * Deliberately absent: fabric types (cotton, rayon, viscose and so on are named
 * nowhere on this site, so there is nothing to answer from), sampling charges,
 * payment terms, and any exact MOQ figure. Adding the fabric list is the single
 * highest-value content addition available — it needs the proprietor, not a
 * developer.
 *
 * Nothing here claims export capability. The business supplies domestically.
 */
export type Faq = {
  question: string;
  answer: string;
};

export const faqs = {
  products: [
    {
      question: "What fabric widths and GSM can you process?",
      answer:
        "Fabric is processed at widths of 44 to 60 inches and across an 80 to 200 GSM range, which covers most apparel, ethnic wear and home textile constructions. Raw fabric is sourced from established suppliers across South India and Bhiwandi, and every lot is checked for consistency and construction before it enters the dyeing or printing line."
    },
    {
      question: "What is the minimum order quantity for printed or dyed fabric?",
      answer:
        "Printed and dyed fabric is quoted per roll, and custom programmes carry a flexible minimum depending on the shade, design and finish involved. Sample runs are available before you commit to a bulk quantity. Share your fabric, quantity and dispatch timeline through the quote form and you will get a quantity band worked out against your specific requirement."
    },
    {
      question: "Can you match a specific shade or develop a pattern we supply?",
      answer:
        "Yes. Custom shade matching and pattern development are part of the standard customer-led route, where dyeing, printing and finishing are shaped around your design direction, quantity and end market. Prepared fabric is dyed to your shade reference under controlled process discipline, and sample runs let you approve the result before bulk production begins."
    },
    {
      question: "Do you sell to the public, or only to businesses?",
      answer:
        "Surjay Design & Print supplies businesses only. Output goes to wholesalers, garment manufacturers, textile traders, private labels and bulk buyers rather than to individual customers, and fabric is dispatched by the roll rather than by the metre. If you are sourcing fabric for resale, for a garment programme or for a private label range, you are in the right place."
    },
    {
      question: "Can you handle repeat bulk orders?",
      answer:
        "Yes. More than 2,500 projects have been delivered for over 80 business clients, a large share of them repeat programmes. Bulk processing is organised around dependable capacity, repeatable quality and transparent execution, and every batch is inspected for shade, print consistency, finish and fabric feel before dispatch so that a repeat run matches the one before it."
    }
  ],

  manufacturingProcess: [
    {
      question: "What is the fabric dyeing process, step by step?",
      answer:
        "Fabric dyeing runs in three stages here. The fabric first goes through Ready For Dyeing preparation, roughly two to four hours of cleaning that removes impurities and improves absorbency. Dyeing itself takes six to ten hours, with prepared fabric dyed to the customer's shade under controlled process discipline. Silicate treatment and a 24 hour fixation window then stabilise the colour."
    },
    {
      question: "How long does fabric processing take from start to finish?",
      answer:
        "A full run takes three to five working days from raw fabric to dispatch-ready stock. That covers all seventeen stages, including procurement, Ready For Dyeing preparation, dyeing, printing, silicate and silicone treatment, the 24 hour fixation window, pressing, elongation, drying, folding, quality inspection and packaging. The fixation stage alone accounts for a full day and cannot be shortened."
    },
    {
      question: "What does textile finishing involve?",
      answer:
        "Finishing is everything that happens after colour has been applied. Silicone softening gives the fabric a smooth hand feel and better drape, pressing smoothens each lot for cleaner presentation, elongation control holds width and dimensional stability across the batch, and a controlled drying range removes residual moisture. The fabric is then folded carefully to preserve appearance before inspection."
    },
    {
      question: "What does RFD, or Ready For Dyeing, mean?",
      answer:
        "Ready For Dyeing is the preparation stage that comes before any colour is applied. The fabric is cleaned to remove impurities left from weaving and handling, which improves how evenly it absorbs dye, and it takes two to four hours. Preparation quality sets the ceiling on shade evenness, so a rushed RFD stage shows up as patchy colour much later in the run."
    },
    {
      question: "Why does colour fixation take a full 24 hours?",
      answer:
        "The fixation window is long on purpose. After dyeing and printing, silicate treatment supports colour fixation and improves durability, and the fabric then rests for 24 hours in a controlled window that lets the shade stabilise before it moves into pressing and final finishing. Shortening this is what causes colour to shift or bleed once the fabric is in use."
    }
  ],

  printingMethods: [
    {
      question: "What is screen printing on fabric?",
      answer:
        "Screen printing pushes dye through a prepared mesh screen, one screen per colour, onto the fabric below. It produces clean repeat patterns with consistent coverage and scales well for commercial fabric orders, which is why it carries most bulk volume here. A screen printing run takes roughly four to eight hours depending on the design and how many colours it uses."
    },
    {
      question: "What is the difference between screen printing and hand block printing?",
      answer:
        "Screen printing gives repeat accuracy and even coverage at volume, and runs in about four to eight hours. Hand block printing is done by hand with carved blocks, takes six to ten hours, and gives each length a character that machine printing cannot reproduce. The choice usually comes down to order size, how exact the repeat has to be, and the market the fabric is going into."
    },
    {
      question: "What is Bagru hand block printing?",
      answer:
        "Bagru is a town outside Jaipur with a long hand block printing tradition, and this factory sits in its RIICO industrial area. Hand printing here brings craft-led detailing and flexible pattern execution to textile programmes that need something distinctive. It runs six to ten hours per lot, which makes it the slower of the two printing routes, and deliberately so."
    },
    {
      question: "Which printing method should I choose for my order?",
      answer:
        "Choose screen printing for larger quantities where the repeat has to be identical across every metre, and hand printing where the fabric's appeal depends on visible craft. Both routes run in-house, so one buyer programme can use screen printing for a core range and hand printing for a premium line. Share your design and quantity and a recommendation comes with the quote."
    },
    {
      question: "How do you keep print consistent across a bulk run?",
      answer:
        "Consistency comes from checking at each stage rather than only at the end. Every batch is inspected for shade, print consistency, finish, fabric feel and dispatch readiness before packing. Elongation control holds width and dimensional stability across the batch, and the 24 hour fixation window stabilises colour, so the last roll off a run matches the first."
    }
  ],

  contact: [
    {
      question: "Where is the factory, and can I visit?",
      answer:
        "The works are at Plot No. D-2, SPL-1, Phase 2nd, Jaipur Block, RIICO Industrial Area, Bagru, Jaipur 303007. Visitors are welcome Monday to Saturday between 9:00 and 18:00. Arranging a visit in advance is worth doing, so that the floor is actually running the processes you came to see rather than sitting between batches."
    },
    {
      question: "Is Surjay Design & Print a registered business?",
      answer:
        "Yes. The firm holds GSTIN 08ANXPS6652G1Z5 and Udyam registration UDYAM-RJ-22-0015640, both publicly verifiable. It has 16+ years of experience since 2010, was formally registered in 2011, and is run by proprietor Ajay Soni. The registered office is in Jodhpur, while the works and all production are at Bagru, Jaipur."
    },
    {
      question: "Do you work with buyers outside Rajasthan?",
      answer:
        "Yes. Fabric is supplied to buyers across India, and raw fabric is already sourced from suppliers in South India and Bhiwandi, so moving goods over distance is routine. Finished fabric is packed as dispatch-ready inventory for wholesalers, garment manufacturers, traders and bulk buyers. Supply is domestic at present."
    },
    {
      question: "How do I get a quote?",
      answer:
        "Use the Request Quote button in the header, or the enquiry form on this page. The more you can say about fabric type, quantity, shade or design reference, and the date you need dispatch by, the more precise the quote will be. You can also call +91 92615 55162 or email surjaydesign@gmail.com during working hours."
    }
  ]
} satisfies Record<string, Faq[]>;
