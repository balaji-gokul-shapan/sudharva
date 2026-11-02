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
  GiftIcon,
  TrophyIcon,
  Award01Icon,
  Calendar01Icon,
  GoogleMapsIcon,
} from "@animateicons/react/huge";
export const heroRuningData = [
  {
    id: 1,
    icon: Clock01Icon,
    color: "text-volunteer",
    count: "10,000+",
    label: "Expected Participants",
  },
  {
    id: 2,
    icon: Building01Icon,
    color: "text-health",
    count: "10+",
    label: "Corporate Partners",
  },
  {
    id: 3,
    icon: Globe02Icon,
    color: "text-environment",
    count: "20,000+",
    label: "Lives to be Impacted",
  },
  {
    id: 4,
    icon: Target01Icon,
    color: "text-education",
    count: "1 Cause",
    label: "A Diabetes Free Tomorrow",
  },
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
    anchorId: "5k",
    label: "5K Run (Community Walk)",
    message: "For a healthier community tomorrow",
    Amount: "₹499",
    description: "Walk together, support your community",
    tag: "comfortable Jog",
    icon: HeartIcon,
    iconBg: "bg-volunteer-tint border border-volunteer/50",
    textColor: "text-volunteer",
    glow: "bg-volunteer/30",
    listingIcon: SparkleIcon,
    bannerImg: "/image/cta/events/5k_walk.webp",
    detailImg: "/image/cta/events/5k_walk_detail.webp",

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
    anchorId: "5k-fun-run",
    label: "5K Run (Fun Run)",
    message: "For every pace, and every first step.",
    Amount: "₹499",
    description: "Run for a cause and make every step count.",
    tag: "comfortable Jog",
    icon: HeartIcon,
    iconBg: "bg-health-tint border border-health/50",
    textColor: "text-health",
    glow: "bg-health/30",
    listingIcon: SparkleIcon,
    bannerImg: "/image/cta/events/5k_run.webp",
    detailImg: "/image/cta/events/5k_run_detail.webp",

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
    anchorId: "10k",
    label: "10K Run (Challenge Run)",
    message: "Half the distance. Double the heart",
    Amount: "₹599",
    description: "Run for a stronger communities and a healthier planet.",
    tag: "Challenging strides",
    icon: Globe02Icon,
    iconBg: "bg-environment-tint border border-environment/50",
    textColor: "text-environment",
    glow: "bg-environment/30",
    listingIcon: SparkleIcon,
    ButtonText: "Register Now",
    bannerImg: "/image/cta/events/10k_run.webp",
    detailImg: "/image/cta/events/10k_run_detail.webp",
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
    anchorId: "half-marathon",
    label: "21.1K Run (Half Marathon)",
    message: "Go the distance for 589 million.",
    Amount: "₹799",
    description: "Run for a Diabetic Free India.",
    tag: "Powerful Pacers",
    icon: BookOpen01Icon,
    iconBg: "bg-education-tint border border-education/50",
    textColor: "text-education",
    glow: "bg-education/30",
    listingIcon: SparkleIcon,
    ButtonText: "Register Now",
    bannerImg: "/image/cta/events/21.1k_run.webp",
    detailImg: "/image/cta/events/21.1k_run_detail.webp",

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

export const EVENT_SUBNAV = [
  {
    id: "5k",
    href: "#5k",
    label: "5K Run",
    title: "5K Community Walk",
    description:
      "A relaxed community walk designed for every age and fitness level.",
    Amount: "₹ 499",
    distance: "5 KM",
    icon: HeartIcon,
  },
  {
    id: "5k-fun-run",
    href: "#5k-fun-run",
    label: "5K Fun Run",
    title: "5K Fun Run",
    description:
      "For every pace and every first step — a fun run for the whole family.",
    Amount: "₹ 499",
    distance: "5 KM",
    icon: SparkleIcon,
  },
  {
    id: "10k",
    href: "#10k",
    label: "10K Challenge",
    title: "10K Challenge Run",
    description: "Push your pace with a challenging course through the city.",
    Amount: "₹ 599",
    distance: "10 KM",
    icon: Target01Icon,
  },
  {
    id: "half-marathon",
    href: "#half-marathon",
    label: "Half Marathon",
    title: "21.1K Half Marathon",
    description: "Go the full distance for a diabetes-free India.",
    Amount: "₹ 799",
    distance: "21.1 KM",
    icon: TrophyIcon,
  },
  {
    id: "team",
    href: "/register",
    label: "Team Entries",
    title: "Corporate Team Entries",
    description: "Register your team and run together for the cause.",
    Amount: "Custom",
    distance: "Team",
    icon: UserGroupIcon,
  },
];

export const META = [
  {
    icon: Calendar01Icon,
    label: "Sunday, 24th January 2027",
  },
  {
    icon: GoogleMapsIcon,
    label: "Ajeya Stadium, Avadi, Chennai",
  },
  {
    icon: Clock01Icon,
    label: "05:00 AM onwards",
  },
];

export const OVERVIEW_SUBNAV = [
  {
    id: "cause",
    href: "/event/rules",
    label: "Rules & Regulations",
    description:
      "Everything you need to know to run safely, stay prepared, and make the most of race day.",
    icon: HeartIcon,
  },
  {
    id: "health-addons",
    href: "/event/prizes",
    label: "Prizes & Awards",
    description:
      "Celebrate every milestone with exciting prizes, exclusive rewards, and unforgettable achievements.",
    icon: ActivityIcon,
  },
  {
    id: "partners",
    href: "/partners",
    label: "Our Partners",
    description:
      "Meet the changemakers supporting healthier lifestyles and stronger communities through every stride.",
    icon: HandshakeIcon,
  },
  {
    id: "join",
    href: "/contact",
    label: "Become a Partner",
    description:
      "Partner with Sudharva Marathon to amplify your brand, inspire communities, and make a lasting impact.",
    icon: UserGroupIcon,
  },
];

/* ------------------------------------------------------------------ */
/*  Prizes — what every registered runner walks away with             */
/* ------------------------------------------------------------------ */

export const eventPrizesData = [
  {
    number: "01",
    title: "Event T-shirt",
    description: "A commemorative Sudharva Marathon running tee.",
    icon: GiftIcon,
    iconBg: "bg-primary/10 border border-primary/40",
    textColor: "text-primary",
  },
  {
    number: "02",
    title: "E-Certificate",
    description: "A digital certificate of participation and finish.",
    icon: Award01Icon,
    iconBg: "bg-accent/10 border border-accent/40",
    textColor: "text-accent",
  },
  {
    number: "03",
    title: "Finisher Medal",
    description: "A medal to mark every step you put on the course.",
    icon: TrophyIcon,
    iconBg: "bg-education/10 border border-education/40",
    textColor: "text-education",
  },
  {
    number: "04",
    title: "Free HbA1c Test",
    description: "A complimentary diabetes screening for every finisher.",
    icon: ActivityIcon,
    iconBg: "bg-health/10 border border-health/40",
    textColor: "text-health",
  },
  {
    number: "05",
    title: "Family Health Coupon",
    description: "A digital coupon for your family’s health checkup.",
    icon: HeartCheckIcon,
    iconBg: "bg-environment/10 border border-environment/40",
    textColor: "text-environment",
  },
  {
    number: "06",
    title: "Refreshments",
    description: "Hydration and refreshments along the route and finish line.",
    icon: ShieldCheckIcon,
    iconBg: "bg-volunteer/10 border border-volunteer/40",
    textColor: "text-volunteer",
  },
];
