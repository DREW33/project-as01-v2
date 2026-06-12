export type Project = {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  caseStudy: string;
  tech: string[];
  accent: string; // tailwind gradient classes for the preview art
  stats: { label: string; value: string }[];
  demoUrl: string;
};

export const categories = [
  "All",
  "E-Commerce",
  "Real Estate",
  "Car Booking",
  "Bridal Makeup",
  "Wedding Planner",
  "Reseller Marketplace",
  "Gaming & Prediction",
  "ERP & CRM",
  "Restaurant",
  "Mobile Apps",
  "Social & Community",
  "Streaming & Media",
  "Crypto & Finance",
  "Developer & SEO Tools",
  "Marketing & Automation",
  "Cloud & Storage",
] as const;

export const projects: Project[] = [
  {
    id: "shopkart",
    title: "ShopKart",
    category: "E-Commerce",
    tagline: "Full-scale online shopping store",
    description:
      "A complete e-commerce platform with product search, deal categories, cart, wishlist, ratings and same-day delivery flow — built for high-volume sales.",
    caseStudy:
      "ShopKart needed a store that loads instantly on cheap Android phones in tier-2 cities. We engineered a lightweight storefront with smart search, deal-driven home page, COD support and a one-page checkout. The result: 46% of visitors add to cart, and the store handles festival-sale traffic spikes without breaking a sweat.",
    tech: ["Next.js", "TypeScript", "Razorpay", "PostgreSQL", "Redis"],
    accent: "from-indigo-600 via-violet-500 to-purple-500",
    stats: [
      { label: "Add-to-cart rate", value: "46%" },
      { label: "Page load", value: "0.8s" },
      { label: "Products", value: "2L+" },
    ],
    demoUrl: "/demos/shopkart.html",
  },
  {
    id: "luxenest",
    title: "LuxeNest Realty",
    category: "Real Estate",
    tagline: "Premium property listing platform",
    description:
      "Elegant real-estate website with property search, verified listings, price filters and free site-visit booking — designed to make every home look like a dream.",
    caseStudy:
      "LuxeNest wanted their website to feel as premium as the homes they sell. We designed a serif-led luxury aesthetic with instant property search, RERA-verified listing badges and a site-visit scheduler. Qualified site-visit bookings grew 4x within two months of launch.",
    tech: ["Next.js", "Tailwind CSS", "PostgreSQL", "Google Maps API"],
    accent: "from-amber-500 via-orange-400 to-purple-500",
    stats: [
      { label: "Site visits booked", value: "4x" },
      { label: "Listings", value: "1,200+" },
      { label: "Property sold", value: "₹420Cr" },
    ],
    demoUrl: "/demos/luxenest.html",
  },
  {
    id: "drivenow",
    title: "DriveNow",
    category: "Car Booking",
    tagline: "Self-drive car rental & booking system",
    description:
      "Car rental platform with live fleet availability, date-based booking, doorstep delivery and instant payment — from hatchbacks to a Mustang GT.",
    caseStudy:
      "DriveNow was taking bookings over phone calls and losing customers after hours. We built a 60-second booking flow with live availability, dynamic pricing per day and automated WhatsApp confirmations. Online bookings now make up 78% of all trips, and night-time bookings — previously zero — bring 22% of revenue.",
    tech: ["React", "Node.js", "Stripe", "PostgreSQL", "Twilio"],
    accent: "from-cyan-500 via-sky-500 to-blue-600",
    stats: [
      { label: "Online bookings", value: "78%" },
      { label: "Booking time", value: "60s" },
      { label: "Fleet", value: "120+" },
    ],
    demoUrl: "/demos/drivenow.html",
  },
  {
    id: "glambride",
    title: "GlamBride Studio",
    category: "Bridal Makeup",
    tagline: "Bridal makeup artist & booking website",
    description:
      "A soft, luxurious website for a bridal makeup artist — packages, real-bride gallery, trial booking and date availability, styled to win hearts instantly.",
    caseStudy:
      "GlamBride's Instagram was popular but inquiries were chaotic DMs. We crafted an elegant website with transparent package pricing, a real-bride gallery and date-based trial booking. Brides now book and pay advance online — bookings doubled in the first wedding season and no-shows dropped to nearly zero.",
    tech: ["Next.js", "Tailwind CSS", "Razorpay", "Calendly API"],
    accent: "from-rose-400 via-pink-400 to-purple-400",
    stats: [
      { label: "Bookings", value: "2x" },
      { label: "Brides styled", value: "500+" },
      { label: "No-shows", value: "~0" },
    ],
    demoUrl: "/demos/glambride.html",
  },
  {
    id: "evermore",
    title: "Evermore Events",
    category: "Wedding Planner",
    tagline: "Luxury wedding planning company site",
    description:
      "A cinematic website for a destination wedding planner — services, gallery of real weddings, planner consultation booking and a brand that smells expensive.",
    caseStudy:
      "Evermore competes for high-budget destination weddings, so the website had to feel like a luxury magazine. We designed an editorial layout with full-bleed photography, service storytelling and a date-availability checker. Average inquiry budget went up 3x because the site now attracts exactly the right clients.",
    tech: ["Next.js", "GSAP", "Tailwind CSS", "Sanity CMS"],
    accent: "from-yellow-600 via-amber-500 to-rose-400",
    stats: [
      { label: "Avg. inquiry budget", value: "3x" },
      { label: "Weddings", value: "300+" },
      { label: "Referral rate", value: "98%" },
    ],
    demoUrl: "/demos/evermore.html",
  },
  {
    id: "resellhub",
    title: "ResellHub",
    category: "Reseller Marketplace",
    tagline: "Buy & sell pre-owned goods marketplace",
    description:
      "A trust-first reseller marketplace with AI-priced listings, expert verification, escrow payments and seller ratings — list an item in 30 seconds.",
    caseStudy:
      "Resale marketplaces die from fraud, so we built trust into every screen: expert verification before listing goes live, escrow-protected payments and transparent seller ratings. The AI listing assistant writes descriptions and suggests prices from photos. Sellers list in 30 seconds and 94% of transactions complete without a dispute.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "OpenAI", "Razorpay"],
    accent: "from-emerald-500 via-teal-500 to-blue-500",
    stats: [
      { label: "Items resold", value: "2.4L+" },
      { label: "Paid to sellers", value: "₹38Cr" },
      { label: "Dispute-free", value: "94%" },
    ],
    demoUrl: "/demos/resellhub.html",
  },
  {
    id: "bigwin",
    title: "BigWin Arena",
    category: "Gaming & Prediction",
    tagline: "Real-time gaming & prediction platform",
    description:
      "High-energy gaming platform with live prediction games, tournaments, jackpot counters, wallets and instant payouts — engineered for 2.8 lakh concurrent players.",
    caseStudy:
      "BigWin needed casino-grade excitement with bank-grade reliability. We built real-time game rounds over WebSockets, a live jackpot engine, provably-fair RNG, wallet with instant withdrawals and an anti-fraud layer. The platform sustains 2.8 lakh concurrent players with sub-100ms round latency.",
    tech: ["React", "Node.js", "Socket.io", "Redis", "PostgreSQL", "Docker"],
    accent: "from-fuchsia-600 via-purple-500 to-amber-400",
    stats: [
      { label: "Concurrent players", value: "2.8L" },
      { label: "Round latency", value: "<100ms" },
      { label: "Payouts", value: "Instant" },
    ],
    demoUrl: "/demos/bigwin.html",
  },
  {
    id: "stratos-erp",
    title: "Stratos ERP",
    category: "ERP & CRM",
    tagline: "Manufacturing ERP & production suite",
    description:
      "Full ERP dashboard with live production stats, inventory valuation, capacity charts, work-order tracking, HR/payroll and GST-ready accounting.",
    caseStudy:
      "A manufacturing group was running four disconnected tools and a wall of spreadsheets. We modeled their entire production flow into one ERP: live work orders, machine uptime tracking, capacity utilisation and dispatch. Month-end closing went from 6 days to 9 hours, and overdue orders dropped 70% because delays surface on the dashboard the moment they happen.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Docker", "AWS"],
    accent: "from-blue-600 via-sky-500 to-indigo-500",
    stats: [
      { label: "Month-end close", value: "9 hrs" },
      { label: "Machine uptime", value: "96.4%" },
      { label: "Tools replaced", value: "4" },
    ],
    demoUrl: "/demos/stratos-erp.html",
  },
  {
    id: "pulsecrm",
    title: "PulseCRM",
    category: "ERP & CRM",
    tagline: "Sales pipeline & lead management CRM",
    description:
      "Dark-mode CRM with a drag-and-drop deal pipeline, AI lead scoring, call logs, quota tracking and automated follow-up sequences.",
    caseStudy:
      "A 40-rep sales team was tracking deals in WhatsApp and losing follow-ups daily. PulseCRM gave them a kanban pipeline, AI-scored leads (31% of new leads now come from our AI calling agent), and automatic follow-up sequences. Win rate climbed 6 points and the average deal cycle shrank by 3 days in the first quarter.",
    tech: ["React", "Node.js", "WebSockets", "PostgreSQL", "Claude API"],
    accent: "from-violet-600 via-purple-500 to-blue-500",
    stats: [
      { label: "Win rate", value: "+6 pts" },
      { label: "Deal cycle", value: "-3 days" },
      { label: "Leads via AI", value: "31%" },
    ],
    demoUrl: "/demos/pulsecrm.html",
  },
  {
    id: "spiceroute",
    title: "Spice Route",
    category: "Restaurant",
    tagline: "Fine-dining restaurant & table booking",
    description:
      "A rich, cinematic restaurant website with signature menu, chef's story, opening hours and a 20-second table reservation flow.",
    caseStudy:
      "Spice Route's weekend tables were booked entirely over phone calls — and half the calls went unanswered during service hours. We built an appetite-inducing website with a 20-second reservation flow and automated WhatsApp confirmations. Online reservations now fill 65% of seats, and no-show rates halved thanks to reminder automation.",
    tech: ["Next.js", "Tailwind CSS", "PostgreSQL", "WhatsApp API"],
    accent: "from-amber-600 via-orange-500 to-red-500",
    stats: [
      { label: "Online reservations", value: "65%" },
      { label: "No-shows", value: "-50%" },
      { label: "Booking time", value: "20s" },
    ],
    demoUrl: "/demos/spiceroute.html",
  },
  {
    id: "zoomride",
    title: "ZoomRide",
    category: "Mobile Apps",
    tagline: "Bike taxi & parcel app (Rapido-style)",
    description:
      "On-demand bike taxi platform with live captain matching, in-app map tracking, upfront fares, parcel delivery and a captain earnings app.",
    caseStudy:
      "ZoomRide needed Rapido-grade tech on a startup budget: rider app, captain app and an ops dashboard. We engineered live geo-matching that finds the nearest captain in under 3 seconds, upfront fare calculation and SOS safety tooling. The fleet completed 10 lakh rides in year one with an average pickup time of 3 minutes.",
    tech: ["React Native", "Node.js", "Socket.io", "Google Maps API", "Razorpay"],
    accent: "from-yellow-500 via-amber-400 to-orange-500",
    stats: [
      { label: "Rides completed", value: "10L+" },
      { label: "Avg. pickup", value: "3 min" },
      { label: "Captains", value: "8,500" },
    ],
    demoUrl: "/demos/zoomride.html",
  },
  {
    id: "loopin",
    title: "LoopIn",
    category: "Social & Community",
    tagline: "Social network for Northeast India",
    description:
      "A community-first social platform with local feeds, 1,800+ interest groups, events and creator profiles — built to scale to lakhs of members.",
    caseStudy:
      "LoopIn wanted a social network that felt local, not like a Facebook clone. We built community-scoped feeds, event RSVPs and creator tools with infinite-scroll performance on budget Android phones. The platform grew to 4.2 lakh members with 1,800+ active communities, and average session time is 23 minutes — social-giant territory.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "WebSockets", "AWS"],
    accent: "from-rose-500 via-pink-500 to-purple-500",
    stats: [
      { label: "Members", value: "4.2L+" },
      { label: "Communities", value: "1,800+" },
      { label: "Avg. session", value: "23 min" },
    ],
    demoUrl: "/demos/loopin.html",
  },
  {
    id: "streamx",
    title: "StreamX",
    category: "Streaming & Media",
    tagline: "OTT streaming platform with live TV",
    description:
      "A Netflix-style OTT platform streaming Northeast stories — originals, live channels, multi-language audio, 4K playback and subscription plans from ₹99.",
    caseStudy:
      "StreamX needed OTT infrastructure on a regional budget: adaptive bitrate streaming for weak networks, DRM-protected content, live TV channels and UPI-first subscriptions. We shipped apps for web, Android and TV. The platform streams to 1.8 lakh subscribers with 99.9% playback success even on 3G connections.",
    tech: ["Next.js", "Node.js", "HLS/FFmpeg", "PostgreSQL", "Razorpay", "CDN"],
    accent: "from-red-600 via-rose-500 to-orange-400",
    stats: [
      { label: "Subscribers", value: "1.8L" },
      { label: "Playback success", value: "99.9%" },
      { label: "Languages", value: "7" },
    ],
    demoUrl: "/demos/streamx.html",
  },
  {
    id: "coinpulse",
    title: "CoinPulse",
    category: "Crypto & Finance",
    tagline: "Crypto portfolio & market tracker",
    description:
      "Real-time crypto tracking for 12,000+ coins — live portfolio P&L, price alerts via Telegram, and one-click Indian crypto tax reports.",
    caseStudy:
      "CoinPulse serves Indian crypto investors who juggle multiple exchanges. We built read-only exchange syncing, sub-second price streaming over WebSockets, smart alerts and 30%-tax-rule compliant ITR reports. 2.1 lakh investors track ₹400Cr+ in assets, and the tax-report feature alone drives 40% of paid conversions.",
    tech: ["React", "Node.js", "WebSockets", "TimescaleDB", "Telegram API"],
    accent: "from-amber-500 via-orange-500 to-yellow-400",
    stats: [
      { label: "Investors", value: "2.1L" },
      { label: "Coins tracked", value: "12k+" },
      { label: "Price latency", value: "<1s" },
    ],
    demoUrl: "/demos/coinpulse.html",
  },
  {
    id: "rankforge",
    title: "RankForge",
    category: "Developer & SEO Tools",
    tagline: "SEO audit & rank-tracking SaaS",
    description:
      "A developer-friendly SEO suite — 38-point site audits in 30 seconds, daily rank tracking, keyword research and Core Web Vitals monitoring.",
    caseStudy:
      "RankForge replaces six marketing subscriptions with one suite. We engineered a crawler that audits 142 pages in 30 seconds, city-level rank tracking for Indian keywords and plain-English fix-it reports that non-developers understand. 1.4 million sites audited, and agencies resell the white-label reports to their own clients.",
    tech: ["Next.js", "Node.js", "Puppeteer", "PostgreSQL", "Redis", "OpenAI"],
    accent: "from-emerald-500 via-green-500 to-teal-400",
    stats: [
      { label: "Sites audited", value: "1.4M" },
      { label: "Checks per scan", value: "38" },
      { label: "Scan time", value: "30s" },
    ],
    demoUrl: "/demos/rankforge.html",
  },
  {
    id: "mailmint",
    title: "MailMint",
    category: "Marketing & Automation",
    tagline: "Email, WhatsApp & SMS automation",
    description:
      "Marketing automation that runs while you sleep — welcome series, abandoned-cart recovery and win-back flows across email, WhatsApp and SMS.",
    caseStudy:
      "MailMint gives small Indian stores enterprise-grade automation in a 10-minute setup. We built a visual flow builder, WhatsApp Business API integration (64% open rates) and rupee-denominated revenue attribution per automation. 2,400 businesses have recovered ₹14Cr+ in abandoned-cart revenue alone.",
    tech: ["Next.js", "Node.js", "WhatsApp API", "PostgreSQL", "Redis", "Claude API"],
    accent: "from-violet-600 via-purple-500 to-fuchsia-400",
    stats: [
      { label: "Revenue recovered", value: "₹14Cr+" },
      { label: "WhatsApp opens", value: "64%" },
      { label: "Businesses", value: "2,400+" },
    ],
    demoUrl: "/demos/mailmint.html",
  },
  {
    id: "cloudvault",
    title: "CloudVault",
    category: "Cloud & Storage",
    tagline: "Encrypted cloud storage for teams",
    description:
      "End-to-end encrypted file storage and sync with team spaces, smart share links, version history — data stored only in Indian data centers.",
    caseStudy:
      "CloudVault targets Indian legal and finance teams who can't put files on foreign clouds. We built zero-knowledge encryption, Mumbai-region storage, role-based team spaces and expiring password-protected share links. Enterprise clients migrated 2.4 PB of data, and the India-only data residency is the #1 cited reason for switching.",
    tech: ["Next.js", "Node.js", "S3-compatible storage", "PostgreSQL", "Docker"],
    accent: "from-sky-500 via-blue-500 to-indigo-500",
    stats: [
      { label: "Data stored", value: "2.4 PB" },
      { label: "Sync speed", value: "<3s" },
      { label: "Uptime", value: "99.99%" },
    ],
    demoUrl: "/demos/cloudvault.html",
  },
];

export const services = [
  {
    icon: "🌐",
    title: "Website Development",
    items: ["Business Websites", "E-Commerce", "Portfolio Sites", "Booking Systems"],
    desc: "Lightning-fast, SEO-perfect websites engineered to convert visitors into customers.",
  },
  {
    icon: "📱",
    title: "App Development",
    items: ["Android Apps", "iOS Apps", "Hybrid Apps", "PWAs"],
    desc: "Native-quality mobile experiences from a single codebase, shipped to both stores.",
  },
  {
    icon: "🤖",
    title: "AI Automation",
    items: ["AI Chatbots", "AI Calling Agents", "CRM Automation", "Business Automation"],
    desc: "Agents that answer, call, qualify and follow up — while you sleep.",
  },
  {
    icon: "⚙️",
    title: "Custom Software",
    items: ["ERP Systems", "Dashboards", "SaaS Products", "Enterprise Solutions"],
    desc: "Bespoke platforms built around your exact workflow, not the other way round.",
  },
  {
    icon: "📊",
    title: "Prediction Platforms",
    items: ["ML Pipelines", "Analytics Engines", "Forecasting", "Backtesting Tools"],
    desc: "Real-time data crunched into confidence-scored signals your team can act on.",
  },
  {
    icon: "🎮",
    title: "Gaming Platforms",
    items: ["Tournament Systems", "Matchmaking", "Wallets", "Live Leaderboards"],
    desc: "Scalable competitive gaming infrastructure that survives finals night.",
  },
];

export const pricing = [
  {
    name: "Starter",
    price: "₹20,000+",
    tag: "Perfect for getting online",
    features: [
      "5-page premium website",
      "Mobile responsive design",
      "Contact form + WhatsApp",
      "Basic SEO setup",
      "Delivery in 7 days",
      "1 month free support",
    ],
    cta: "Start a Project",
    featured: false,
  },
  {
    name: "Business",
    price: "₹50,000+",
    tag: "Most popular for growing brands",
    features: [
      "Custom website or web app",
      "Admin dashboard + CMS",
      "AI chatbot integration",
      "Payment gateway setup",
      "Advanced SEO + analytics",
      "Delivery in 2–4 weeks",
      "3 months priority support",
    ],
    cta: "Get a Quote",
    featured: true,
  },
  {
    name: "Premium",
    price: "Custom",
    tag: "Enterprise & AI systems",
    features: [
      "Full product engineering",
      "AI calling + automation suite",
      "Mobile apps (iOS + Android)",
      "Dedicated project team",
      "SLA-backed support",
      "Scalable cloud architecture",
      "Ongoing growth partnership",
    ],
    cta: "Book a Call",
    featured: false,
  },
];

export const testimonials = [
  {
    name: "Rahul Mehta",
    company: "NovaCommerce",
    role: "Founder & CEO",
    rating: 5,
    review:
      "Project AS01 rebuilt our store and conversions jumped 64% in the first quarter. The AI recommendations alone paid for the project. Easily the best dev team we've worked with.",
    avatar: "RM",
  },
  {
    name: "Sneha Kapoor",
    company: "MediBook Health",
    role: "Head of Digital",
    rating: 5,
    review:
      "They shipped our iOS and Android apps in 12 weeks flat. Patients love it, our front desk loves it more. Communication was crystal clear from day one.",
    avatar: "SK",
  },
  {
    name: "Arjun Nair",
    company: "ArenaX Gaming",
    role: "CTO",
    rating: 5,
    review:
      "140k concurrent users on finals night and the platform didn't even blink. These guys engineer for scale like nobody else at this price point.",
    avatar: "AN",
  },
  {
    name: "Priya Sharma",
    company: "Luxe Estates",
    role: "Marketing Director",
    rating: 5,
    review:
      "Our website finally feels as premium as our properties. The AI concierge qualifies buyers before my team even picks up the phone. 5x more qualified inquiries.",
    avatar: "PS",
  },
  {
    name: "Vikram Singh",
    company: "Stratos Group",
    role: "Operations Head",
    rating: 5,
    review:
      "Month-end closing went from 6 days to 9 hours. The ERP fits our factory like a glove because they actually sat with our team and understood the workflow.",
    avatar: "VS",
  },
];

export const journey = [
  { step: "Idea", icon: "💡", desc: "Free consultation, requirement mapping and a clear proposal within 48 hours." },
  { step: "Design", icon: "🎨", desc: "Wireframes to pixel-perfect UI. You approve every screen before we write code." },
  { step: "Development", icon: "⚡", desc: "Agile sprints with weekly demos. Watch your product come alive in real time." },
  { step: "Testing", icon: "🧪", desc: "Automated + manual QA across devices. Performance, security and load tested." },
  { step: "Launch", icon: "🚀", desc: "Zero-downtime deployment, SEO submission, analytics and monitoring wired up." },
  { step: "Growth", icon: "📈", desc: "Ongoing support, A/B testing and AI automation to keep conversions climbing." },
];
