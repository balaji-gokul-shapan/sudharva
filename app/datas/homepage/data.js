import {
  BookOpen01Icon,
  EyeIcon,
  Globe02Icon,
  HandshakeIcon,
  HeartIcon,
  SearchIcon,
  Target01Icon,
  UserGroupIcon,
  SparkleIcon,
  ShieldCheckIcon,
  ActivityIcon,
  HeartCheckIcon,
  SendIcon,
  QrCode01Icon,
  Building01Icon,
  Clock01Icon,
} from "@animateicons/react/huge";

export const heroRuningData = [
  { id: 1, icon: Clock01Icon, color: "text-volunteer", count: "10,000+", label: "Expected Participants" },
  { id: 2, icon: Building01Icon, color: "text-health", count: "10+", label: "Corporate Partners" },
  { id: 3, icon: Globe02Icon, color: "text-environment", count: "20,000+", label: "Lives to be Impacted" },
  { id: 4, icon: Target01Icon, color: "text-education", count: "1 Cause", label: "A Diabetes Free Tomorrow" },
];

export const overviewData = [
  {
    id: 1,
    icon: EyeIcon,
    label: "Awareness & Education",
    description:
      "Shattering myths and spreading science-backed knowledge about diabetes prevention.",
    iconBg: "bg-health-tint border border-health",
    textColor: "text-health",
    accent: "#2a6f97",
    cardBg: "border-health",
    numberBg: "text-health/30",
  },
  {
    id: 2,
    icon: SearchIcon,
    label: "Early Detection",
    description:
      "Free screenings and risk assessments that catch warning signs before it is too late.",
    iconBg: "bg-volunteer-tint border border-volunteer/50",
    textColor: "text-volunteer/90",
    accent: "#2563eb",
    cardBg: "border-volunteer",
    numberBg: "text-volunteer/30",
  },
  {
    id: 3,
    icon: HandshakeIcon,
    label: "Community Support",
    description:
      "Building a caring network where no one has to manage diabetes alone.",
    iconBg: "bg-education-tint border border-education",
    textColor: "text-education",
    accent: "#b8722a",
    cardBg: "border-education",
    numberBg: "text-education/30",
  },
  {
    id: 4,
    icon: Target01Icon,
    label: "Healthy Lifestyle",
    description:
      "Inspiring lasting habits of movement, nutrition and everyday wellbeing.",
    iconBg: "bg-environment-tint border border-environment",
    numberBg: "text-environment/30",
    textColor: "text-environment",
    accent: "#4b7b3e",
    cardBg: "border-environment",
  },
];

export const eventCategoriesData = [
  {
    number: "01",
    key: "volunteer",
    label: "5K Run (Community Walk)",
    message: "For a healthier community tomorrow",
    Amount: "₹ 500",
    description: "Walk together, support your community",
    tag: "comfortable Jog",
    icon: HeartIcon,
    iconBg: "bg-volunteer-tint border border-volunteer/50",
    textColor: "text-volunteer",
    glow: "bg-volunteer/30",
    listingIcon: SparkleIcon,

    benefits: [
      "Event T-shirt",
      "E-certificate",
      "Finisher Medal",
      "Free HbA1c Test",
      "Digital Family Health Coupen",
      "Refreshements",
    ],
    ButtonText: "Register Now",
  },
  {
    number: "02",
    key: "health",
    label: "5K Run (Fun Run)",
    message: "For every pace, and every first step.",
    Amount: "₹ 500",
    description: "Run for a cause and make every step count.",
    tag: "comfortable Jog",
    icon: HeartIcon,
    iconBg: "bg-health-tint border border-health/50",
    textColor: "text-health",
    glow: "bg-health/30",
    listingIcon: SparkleIcon,

    benefits: [
      "Event T-shirt",
      "E-certificate",
      "Finisher Medal",
      "Free HbA1c Test",
      "Digital Family Health Coupen",
      "Refreshements",
    ],
    ButtonText: "Register Now",
  },
  {
    number: "03",
    key: "environment",
    label: "10K Run (Challenge Run)",
    message: "Half the distance. Double the heart",
    Amount: "₹ 800",
    description: "Run for a stronger communities and a healthier planet.",
    tag: "Challenging strides",
    icon: Globe02Icon,
    iconBg: "bg-environment-tint border border-environment/50",
    textColor: "text-environment",
    glow: "bg-environment/30",
    listingIcon: SparkleIcon,
    ButtonText: "Register Now",
    benefits: [
      "Event T-shirt",
      "E-certificate",
      "Finisher Medal",
      "Free HbA1c Test",
      "Digital Family Health Coupen",
      "Refreshements",
    ],
  },
  {
    number: "04",
    key: "education",
    label: "21.1K Run (Half Marathon)",
    message: "Go the distance for 589 million.",
    Amount: "₹ 1,200",
    description: "Run for a Diabetic Free India.",
    tag: "Powerful Pacers",
    icon: BookOpen01Icon,
    iconBg: "bg-education-tint border border-education/50",
    textColor: "text-education",
    glow: "bg-education/30",
    listingIcon: SparkleIcon,
    ButtonText: "Register Now",

    benefits: [
      "Event T-shirt",
      "E-certificate",
      "Finisher Medal",
      "Free HbA1c Test",
      "Digital Family Health Coupen",
      "Refreshements",
    ],
  },
  // {
  //   number: "04",
  //   key: "volunteer",
  //   label: "Volunteer Crew",
  //   message: "All hands welcome",
  //   description:
  //     "Cheer squads, hydration stations and registration desks powered by volunteers like you.",
  //   tag: "Join Us",
  //   icon: UserGroupIcon,
  //   iconBg: "bg-volunteer-tint border border-volunteer/50",
  //   textcolor: "text-volunteer",
  //   glow: "bg-volunteer/30",
  // },
];

export const addonData = [
  {
    id: 1,
    icon: ActivityIcon,
    label: "Know Your Numbers",
    description: "Understand your long-term blood sugar levels..",
    textColor: "text-health",
    iconBg: "bg-health/20 text-health ring-1 ring-health/30",
  },
  {
    id: 2,
    icon: ShieldCheckIcon,
    label: "Prevent Future Risks",
    description: "Stay ahead of diabetes and related health issues.",
    textColor: "text-environment",
    iconBg: "bg-environment/20 text-environment ring-1 ring-environment/30",
  },
  {
    id: 3,
    icon: HeartCheckIcon,
    label: "For You & Your Loved Ones",
    description: "Better health today, stronger tomorrows.",
    textColor: "text-education",
    iconBg: "bg-education/20 text-education ring-1 ring-education/30",
  },
  {
    id: 4,
    icon: HandshakeIcon,
    label: "Share to Your Community",
    description:
      "Share the coupen with your friends and family to promote community health.",
    textColor: "text-accent",
    iconBg: "bg-accent/10 text-accent ring-1 ring-accent/30",
  },
];

export const extraAddonData = [
  {
    id: 1,
    icon: QrCode01Icon,
    label: "Unique QR Code Coupon",
    iconBg: "bg-transparent text-health ring-1 ring-health/30",
  },
  {
    id: 2,
    icon: SendIcon,
    label: "Share via WhatsApp, SMS or Email",
    iconBg: "bg-transparent text-environment ring-1 ring-environment/30",
  },
  {
    id: 3,
    icon: Building01Icon,
    label: "Redeem at Partner Labs/Hospitals  ",
    iconBg: "bg-transparent text-education ring-1 ring-education/30",
  },
  {
    id: 4,
    icon: HeartCheckIcon,
    label: "Help your near and dear ones stay healthy  ",
    iconBg: "bg-transparent text-accent ring-1 ring-accent/30",
  },
];
export const imageLogos = [
  {
    src: "/image/cta/bisleri_soda_homepage_banner.jpg",
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: "/image/cta/apollo_banner.webp",
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: "/image/cta/appa-logo.svg",
    alt: "Company 3",
    href: "https://www.appatrust.com",
  },
  {
    src: "/image/cta/sms.webp",
    alt: "Company 4",
    href: "https://www.sms24hrs.com",
  },
];

export const SLIDES = [
  {
    src: "/image/cta/hero-banner.png",
    alt: "Sudharva Marathon hero banner",
    heading: "Run Against Diabetes",
    caption: "Join the movement for a healthier, stronger community.",
  },
  {
    src: "/image/cta/runner_Hero_banner.jpg",
    alt: "Event day at SMS Hospital",
    heading: "Event Day",
    caption: "5K, 10K, and 21.1K categories open for registration.",
  },
  {
    src: "/image/cta/hero-banner.png",
    alt: "Partner with us",
    heading: "Become a Partner",
    caption: "Champion wellness and empower communities with us.",
  },
];
