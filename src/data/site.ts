export const site = {
  name: "Surjay Design & Prints",
  legalName: "SURJAY DESIGN & PRINT", // as registered (GST / Udyam)
  proprietor: "Ajay Soni",
  tagline: "Premium textile dyeing, printing and finishing for B2B buyers.",
  location: "Bagru, Jaipur, Rajasthan, India",

  // Canonical site URL — drives canonical tags, OG/social previews, sitemap,
  // robots and structured data. Set NEXT_PUBLIC_SITE_URL to the custom domain
  // once it is live; until then this stable Vercel URL is correct.
  //
  // Deliberately does NOT fall back to NEXT_PUBLIC_VERCEL_URL: that resolves to a
  // per-deployment hostname (…-2edvdb770-….vercel.app) which changes on every
  // push, so canonicals would churn and the mail relay would see a new origin
  // each deploy. This value must stay stable.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://surjay-design-prints.vercel.app",

  phone: "+91 76186 54887",
  phoneHref: "+917618654887", // tel: links must not contain spaces

  // Address shown publicly to buyers (also the one on the Udyam registration).
  // NOTE: this file is imported by client components, so never put the private
  // lead-delivery inbox here — it lives server-side in src/lib/leadInbox.ts.
  email: "surjaydesign@gmail.com",
  whatsapp: "917618654887",
  hours: "Monday to Saturday, 10:00 AM - 6:00 PM",
  hoursShort: "Mon–Sat, 10:00–18:00",

  // Timeline. Experience dates from 2010; the firm was formally registered in
  // 2011 (per the Udyam certificate). Always present it as
  // "16+ years of experience since 2010 · registered 2011" — never as
  // "established 16 years ago", which the registration would contradict.
  experienceSince: 2010,
  registeredYear: 2011,

  // Factory / works address (visitors welcome)
  address: {
    line1: "Plot No. D-2, SPL-1, Phase 2nd",
    line2: "Jaipur Block, RIICO Industrial Area",
    locality: "Bagru",
    city: "Jaipur",
    region: "Rajasthan",
    postalCode: "303007",
    country: "IN",
    full: "Plot No. D-2, SPL-1, Phase 2nd, Jaipur Block, RIICO Industrial Area, Bagru, Jaipur, Rajasthan 303007"
  },
  mapsUrl: "https://maps.app.goo.gl/GRbfs3GE56gzefu5A",

  // Registered office as per the GST / Udyam registrations (Jodhpur).
  // Distinct from the Bagru works address above — both are shown publicly.
  registeredOffice: {
    line1: "2/1006, Kudi Bhagtasni Housing Board",
    line2: "Basni First Phase",
    city: "Jodhpur",
    region: "Rajasthan",
    postalCode: "342005",
    country: "IN",
    full: "2/1006, Kudi Bhagtasni Housing Board, Basni First Phase, Jodhpur, Rajasthan 342005"
  },

  // Business facts
  employees: "40-45",
  visitorsWelcome: true,

  // Statutory registrations (publicly verifiable)
  registrations: {
    gstin: "08ANXPS6652G1Z5",
    udyam: "UDYAM-RJ-22-0015640"
  },
  keywords: [
    "Textile Manufacturer India",
    "Fabric Dyeing",
    "Fabric Printing",
    "Screen Printing",
    "Hand Printing",
    "Textile Processing",
    "Textile Manufacturer Rajasthan",
    "Bulk Fabric Supplier",
    "Textile Export"
  ]
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/manufacturing-process", label: "Process" },
  { href: "/printing-methods", label: "Printing" },
  { href: "/products", label: "Products" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

/**
 * Photography from the Bagru factory, processed by scripts/process-media.mjs
 * from the originals in media-inbox/photos/<PROCESS>/. Keys are grouped and
 * named by the manufacturing stage the photo actually shows, so a slot can
 * never quietly drift onto the wrong process.
 *
 * Every manufacturing step on the site holds its own image — nothing is shared
 * between steps. Where a process appears on more than one page, the pages take
 * different photos from that folder. See the script header for the full rules.
 */
export const imageAssets = {
  hero: "/images/hand-print-hall.jpg", // red bandana print down the printing hall

  // Raw fabric
  rawBales: "/images/raw-bales.jpg",
  rawRolls: "/images/raw-rolls.jpg",

  // Ready for dyeing
  rfdPile: "/images/rfd-pile.jpg",
  rfdRoller: "/images/rfd-roller.jpg",
  rfdBeam: "/images/rfd-beam.jpg",
  rfdWinding: "/images/rfd-winding.jpg", // still pulled from the 4K RFD clip

  // Fabric cleaning and preparation
  cleaningTank: "/images/cleaning-tank.jpg",
  cleaningTrolley: "/images/cleaning-trolley.jpg",
  cleaningRollers: "/images/cleaning-rollers.jpg",
  cleaningPile: "/images/cleaning-pile.jpg",
  cleaningBeam: "/images/cleaning-beam.jpg",

  // Dyeing
  dyeingMachine: "/images/dyeing-machine.jpg",
  dyeDrum: "/images/dye-drum.jpg",

  // Silicate fixation and silicone softening
  silicateTreatment: "/images/silicate-treatment.jpg",
  siliconeTreatment: "/images/silicone-treatment.jpg",
  siliconeMagenta: "/images/silicone-magenta.jpg",

  // 24-hour colour fixation
  fixationStock: "/images/fixation-stock.jpg",

  // Screen printing
  printGreen: "/images/print-green.jpg",
  printGreenScreen: "/images/print-green-screen.jpg",
  printTableDark: "/images/print-table-dark.jpg",
  printMono: "/images/print-mono.jpg",
  printMonoScreen: "/images/print-mono-screen.jpg",

  // Hand printing
  handPrintHall: "/images/hand-print-hall.jpg",
  handPrintTable: "/images/hand-print-table.jpg",
  handPrintDetail: "/images/hand-print-detail.jpg",

  // Design and screen preparation
  designSetup: "/images/design-setup.jpg",
  designScreen: "/images/design-screen.jpg",
  designScreenPortrait: "/images/design-screen-portrait.jpg",
  screenFrame: "/images/screen-frame.jpg",

  // Pressing, elongation, drying
  pressingLine: "/images/pressing-line.jpg",
  pressingRollers: "/images/pressing-rollers.jpg",
  elongationLoops: "/images/elongation-loops.jpg",
  elongationLine: "/images/elongation-line.jpg",
  elongationFeed: "/images/elongation-feed.jpg",
  elongationRoll: "/images/elongation-roll.jpg",
  dryingColour: "/images/drying-colour.jpg",
  dryingWhite: "/images/drying-white.jpg",

  // Folding, inspection, packing, dispatch
  folding: "/images/folding.jpg",
  foldingDetail: "/images/folding-detail.jpg",
  qualityInspection: "/images/quality-inspection.jpg",
  qualityTable: "/images/quality-table.jpg",
  packaging: "/images/packaging.jpg",
  marketReady: "/images/market-ready.jpg",
  marketReadyWide: "/images/market-ready-wide.jpg",
  marketReadyRolls: "/images/market-ready-rolls.jpg",

  ceo: "/images/ceo.jpeg" // awaiting a new founder portrait
};

/**
 * Factory footage from media-inbox/videos/<PROCESS>/, re-encoded to short loops.
 * Each folder's longest clip wins; the three screenPrinting* entries are separate
 * segments of one 20-second take, so the home hero, the process page and the
 * gallery each show a different part of the printing hall.
 *
 * The clips KEEP their live factory audio (mono AAC). Inline players mute via the
 * `muted` attribute; only VideoLightbox lets a visitor unmute.
 *
 * Stages with no clip, and why:
 *   FOLDING, PACKAGING          — only ever photographed
 *   raw fabric (2s)             — too short to loop
 *   24 HOUR FABRIC PRESERVE     — 1.6s, too short to loop
 * Those stages use stills instead.
 *
 * The four `…Timeline` keys at the end are cut from takes no page uses, so the
 * ManufacturingTimeline card never replays footage seen elsewhere on the site.
 */
export const videoAssets = {
  screenPrinting: "/videos/screen-printing.mp4",
  screenPrintingTable: "/videos/screen-printing-table.mp4",
  screenPrintingRun: "/videos/screen-printing-run.mp4",
  handPrinting: "/videos/hand-printing.mp4",
  dyeing: "/videos/dyeing.mp4",
  dyeDrum: "/videos/dye-drum.mp4",
  fabricCleaning: "/videos/fabric-cleaning.mp4",
  rfd: "/videos/rfd.mp4",
  silicone: "/videos/silicone.mp4",
  pressing: "/videos/pressing.mp4",
  elongation: "/videos/elongation.mp4",
  elongationRun: "/videos/elongation-run.mp4",
  elongationWide: "/videos/elongation-wide.mp4",
  dryingRange: "/videos/drying-range.mp4",
  qualityInspection: "/videos/quality-inspection.mp4",
  marketReady: "/videos/market-ready.mp4",

  // Timeline-only clips — see the note above.
  rfdTimeline: "/videos/rfd-beam.mp4",
  fabricCleaningTimeline: "/videos/fabric-cleaning-prep.mp4",
  silicateTimeline: "/videos/silicate.mp4",
  pressingTimeline: "/videos/pressing-roll.mp4"
};

/** Poster frame for each video, keyed the same way and cut from the encoded clip. */
export const videoPosters: Record<keyof typeof videoAssets, string> = {
  screenPrinting: "/images/screen-printing-poster.jpg",
  screenPrintingTable: "/images/screen-printing-table-poster.jpg",
  screenPrintingRun: "/images/screen-printing-run-poster.jpg",
  handPrinting: "/images/hand-printing-poster.jpg",
  dyeing: "/images/dyeing-poster.jpg",
  dyeDrum: "/images/dye-drum-poster.jpg",
  fabricCleaning: "/images/fabric-cleaning-poster.jpg",
  rfd: "/images/rfd-poster.jpg",
  silicone: "/images/silicone-poster.jpg",
  pressing: "/images/pressing-poster.jpg",
  elongation: "/images/elongation-poster.jpg",
  elongationRun: "/images/elongation-run-poster.jpg",
  elongationWide: "/images/elongation-wide-poster.jpg",
  dryingRange: "/images/drying-range-poster.jpg",
  qualityInspection: "/images/quality-inspection-poster.jpg",
  marketReady: "/images/market-ready-poster.jpg",

  rfdTimeline: "/images/rfd-beam-poster.jpg",
  fabricCleaningTimeline: "/images/fabric-cleaning-prep-poster.jpg",
  silicateTimeline: "/images/silicate-poster.jpg",
  pressingTimeline: "/images/pressing-roll-poster.jpg"
};

export const stats = [
  { value: 16, suffix: "+", label: "Years of Experience" },
  { value: 2500, suffix: "+", label: "Projects Delivered" },
  { value: 80, suffix: "+", label: "Business Clients" },
  { value: 10000, suffix: "+", label: "Fabric Designs" }
];

export const processSteps = [
  {
    title: "Raw Fabric Procurement",
    icon: "PackageSearch",
    description:
      "Raw fabrics are sourced from trusted suppliers across South India and Bhiwandi, selected for consistency, construction and suitability for customer requirements."
  },
  {
    title: "Ready For Dyeing (RFD)",
    icon: "Sparkles",
    description:
      "The fabric undergoes cleaning and preparation to remove impurities and improve absorbency before dyeing or printing."
  },
  {
    title: "Dyeing",
    icon: "Droplets",
    description:
      "Prepared fabric is dyed according to customer shade, bulk order and end-use requirements with controlled process discipline."
  },
  {
    title: "Printing",
    icon: "Paintbrush",
    description:
      "Printing capabilities support both repeat design production and custom textile requirements for bulk buyers."
  },
  {
    title: "Screen Printing",
    icon: "PanelsTopLeft",
    description:
      "Screen printing enables clean repeat patterns, consistent coverage and scalable production for commercial fabric orders."
  },
  {
    title: "Hand Printing",
    icon: "Hand",
    description:
      "Hand printing brings craft-led detailing and flexible pattern execution for distinctive textile programs."
  },
  {
    title: "Silicate Treatment",
    icon: "ShieldCheck",
    description:
      "Silicate treatment supports color fixation and improves durability through the next stages of finishing and handling."
  },
  {
    title: "Silicone Softening",
    icon: "Waves",
    description:
      "Silicone softening gives the fabric a smooth, premium hand feel while improving drape and perceived finish quality."
  },
  {
    title: "24 Hour Color Fixation",
    icon: "Timer",
    description:
      "A controlled fixation window helps stabilize the color outcome before the fabric moves into pressing and final finishing."
  },
  {
    title: "Pressing",
    icon: "BadgeCheck",
    description:
      "Pressing smoothens the finished fabric and gives each lot a cleaner presentation before folding and packing."
  },
  {
    title: "Elongation",
    icon: "MoveHorizontal",
    description:
      "Elongation control helps maintain width, dimensional stability and handling consistency across the batch."
  },
  {
    title: "Drying Range",
    icon: "Wind",
    description:
      "Controlled drying reduces residual moisture and stabilizes the fabric before folding, packing and dispatch."
  },
  {
    title: "Folding",
    icon: "Layers",
    description:
      "Finished fabric is folded carefully to preserve appearance, reduce handling issues and prepare it for inspection."
  },
  {
    title: "Quality Inspection",
    icon: "SearchCheck",
    description:
      "Each batch is inspected for shade, print consistency, finish, fabric feel and dispatch readiness."
  },
  {
    title: "Packaging",
    icon: "PackageCheck",
    description:
      "Market-ready products are packed securely and prepared for wholesalers, garment manufacturers, traders and bulk buyers."
  },
  {
    title: "Market Ready Products",
    icon: "Truck",
    description:
      "Finished fabric moves out as reliable, business-ready inventory for domestic supply and future export opportunities."
  }
];

export const productCategories = [
  {
    title: "Printed Fabrics",
    image: imageAssets.printMono,
    description:
      "Screen printed and hand printed fabrics developed for wholesalers, garment manufacturers and textile traders.",
    applications: ["Apparel", "Ethnic wear", "Home textiles", "Trade inventory"]
  },
  {
    title: "Dyed Fabrics",
    image: imageAssets.siliconeMagenta,
    description:
      "Bulk dyed fabrics processed with attention to shade consistency, softness, finish and dispatch presentation.",
    applications: ["Garment manufacturing", "Resale", "Uniform fabric", "Seasonal ranges"]
  },
  {
    title: "Custom Fabrics",
    image: imageAssets.designSetup,
    description:
      "Customer-led dyeing, printing and finishing programs shaped around design direction, quantity and market needs.",
    applications: ["Private labels", "Custom patterns", "Regional ranges", "Buyer programs"]
  },
  {
    title: "Bulk Manufacturing",
    image: imageAssets.marketReadyWide,
    description:
      "Organized fabric processing for buyers who need dependable capacity, repeatable quality and transparent execution.",
    applications: ["Wholesalers", "Textile traders", "Bulk buyers", "Export-ready supply"]
  }
];

export const whyChoose = [
  "Premium Manufacturing",
  "Skilled Workforce",
  "Quality Assurance",
  "Modern Infrastructure",
  "Customized Solutions",
  "Reliable Delivery",
  "Transparent Manufacturing"
];

/**
 * Shown only until the first real testimonial is added at /admin/testimonials.
 *
 * These are summaries of what buyers say, so they carry a segment rather than a
 * name and face. Presenting them as named individuals — which is how they read
 * before — is exactly the pattern trade buyers discount as invented.
 */
export const fallbackTestimonials = [
  {
    quote:
      "Surjay Design & Prints understands bulk fabric expectations and communicates clearly from processing to dispatch.",
    segment: "Wholesale buyers · Jaipur textile market"
  },
  {
    quote:
      "The finishing quality and print consistency make them a dependable partner for repeat garment production.",
    segment: "Garment manufacturers · North India"
  }
];

export const infrastructure = [
  "Factory",
  "Machinery",
  "Production Floor",
  "Drying Range",
  "Printing Tables",
  "Dyeing Machines",
  "Folding Machines",
  "Quality Control",
  "Production Capacity"
];

export const values = [
  {
    title: "Consistency",
    body: "Every batch is treated as a business commitment, with process discipline from raw fabric intake to packaging."
  },
  {
    title: "Craft",
    body: "The company combines practical manufacturing knowledge with printing and finishing skills built for textile markets."
  },
  {
    title: "Partnership",
    body: "Surjay Design & Prints works with wholesalers, traders, manufacturers and buyers who need responsive execution."
  },
  {
    title: "Ambition",
    body: "The long-term vision is a nationally and internationally trusted textile manufacturing brand from Rajasthan."
  }
];
