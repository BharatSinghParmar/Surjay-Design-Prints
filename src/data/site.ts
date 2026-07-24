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

export const imageAssets = {
  // Original AI-generated placeholders (kept as fallback)
  hero: "/images/printing-textile.jpeg",
  dyeing: "/images/dying-textile-2.jpeg",
  printing: "/images/printing-textile-2.jpeg",
  // Real factory photography
  rawFabric: "/images/raw-fabric.jpeg",
  dyeingMachine: "/images/dying-textile.jpeg",
  dyeingMachine2: "/images/dying-textile-2.jpeg",
  dyedPress: "/images/dyed-cloth-press.jpeg",
  printingHall: "/images/printing-textile.jpeg",
  printingFabric: "/images/printing-textile-2.jpeg",
  ceo: "/images/ceo.jpeg"
};

export const videoAssets = {
  printingMachine: "/videos/printing-machine.mp4",
  dyeingProcess: "/videos/dying-process.mp4",
  printingTextile: "/videos/printing-textile.mp4"
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
    image: "/images/printing-textile-2.jpeg",
    description:
      "Screen printed and hand printed fabrics developed for wholesalers, garment manufacturers and textile traders.",
    applications: ["Apparel", "Ethnic wear", "Home textiles", "Trade inventory"]
  },
  {
    title: "Dyed Fabrics",
    image: "/images/dyed-product.jpeg",
    description:
      "Bulk dyed fabrics processed with attention to shade consistency, softness, finish and dispatch presentation.",
    applications: ["Garment manufacturing", "Resale", "Uniform fabric", "Seasonal ranges"]
  },
  {
    title: "Custom Fabrics",
    image: "/images/products-to-sell.jpeg",
    description:
      "Customer-led dyeing, printing and finishing programs shaped around design direction, quantity and market needs.",
    applications: ["Private labels", "Custom patterns", "Regional ranges", "Buyer programs"]
  },
  {
    title: "Bulk Manufacturing",
    image: "/images/printing-textile.jpeg",
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

export const testimonials = [
  {
    quote:
      "Surjay Design & Prints understands bulk fabric expectations and communicates clearly from processing to dispatch.",
    name: "Wholesale Fabric Buyer",
    role: "Jaipur textile market"
  },
  {
    quote:
      "The finishing quality and print consistency make them a dependable partner for repeat garment production.",
    name: "Garment Manufacturer",
    role: "North India"
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
