import {
  ActivityIcon,
  UserCircleIcon,
  HeartIcon,
  HeartCheckIcon,
  UserGroupIcon,
  GoogleGeminiIcon,
  ArrowUpRight01Icon,
  AddSquareIcon,
  Building01Icon,
  SparkleIcon,
  Globe02Icon,
  TelegramIcon,
} from "@animateicons/react/huge";

export const awarenessTopics = [
  {
    number: "01",
    title: "Type 2 Diabetes Prevention",
    description:
      "Build healthier habits and understand the everyday choices that can help reduce risk.",
    icon: ActivityIcon,
    tag: "PREVENT",
    color: "#A7F3D0",
  },
  {
    number: "02",
    title: "Early Detection",
    description:
      "Encourage periodic health screening and timely conversations with healthcare professionals.",
    icon: UserCircleIcon,
    tag: "SCREEN",
    color: "#FDBA74",
  },
  {
    number: "03",
    title: "Healthy Lifestyle Adoption",
    description:
      "Make balanced food choices, consistent routines, and sustainable habits part of everyday life.",
    icon: HeartIcon,
    tag: "NOURISH",
    color: "#FDA4AF",
  },
  {
    number: "04",
    title: "Physical Activity",
    description:
      "Make movement a regular part of life through walking, running, and activities you enjoy.",
    icon: GoogleGeminiIcon,
    tag: "MOVE",
    color: "#93C5FD",
  },
  {
    number: "05",
    title: "Weight Management",
    description:
      "Promote realistic, sustainable habits that support overall health and individual wellbeing.",
    icon: ActivityIcon,
    tag: "BALANCE",
    color: "#D8B4FE",
  },
  {
    number: "06",
    title: "Family Health Awareness",
    description:
      "Bring families together to support preventive care and healthier choices for everyone.",
    icon: UserGroupIcon,
    tag: "TOGETHER",
    color: "#FDE68A",
  },
];

export const objectives = [
  {
    number: "01",
    title: "Healthy lives, stronger futures.",
    description:
      "Promote healthy lifestyles, physical activity, and preventive healthcare.",
    icon: HeartIcon,
    tag: "HEALTH & WELLNESS",
  },
  {
    number: "02",
    title: "Bring the community together.",
    description:
      "Encourage families, students, and communities to participate in fitness activities.",
    icon: UserGroupIcon,
    tag: "COMMUNITY",
  },
  {
    number: "03",
    title: "Make every step meaningful.",
    description:
      "Create awareness for charitable initiatives and inspire positive change.",
    icon: HeartIcon,
    tag: "SOCIAL IMPACT",
  },
  {
    number: "04",
    title: "Turn partnerships into impact.",
    description:
      "Connect corporate teams, sponsors, and organizations through a shared purpose.",
    icon: Building01Icon,
    tag: "CORPORATE PARTNERSHIPS",
  },
  {
    number: "05",
    title: "A healthier society for all.",
    description: "Support social welfare and public health programs.",
    icon: SparkleIcon,
    tag: "PUBLIC HEALTH",
  },
];

export const highlights = [
  {
    id: "participants",
    number: "10,000+",
    title: "Expected participants",
    description:
      "Thousands of runners. One community. A shared commitment to better health.",
    icon: UserGroupIcon,
    className: "md:col-span-2 md:row-span-2 bg-primary text-foreground",
    large: true,
    titleClassName: "text-2xl sm:text-3xl text-white",
    countClassName: "text-white",
  },
  {
    id: "corporate",
    number: "50+",
    title: "Corporate teams",
    description: "Organizations running together for a greater cause.",
    icon: Building01Icon,
    className: "bg-card text-card-foreground border border-border",
    titleClassName: "text-3xl sm:text-3xl text-accent",
    countClassName: "text-primary",
  },
  {
    id: "reach",
    number: "100K+",
    title: "Digital reach",
    description: "Taking the message of health beyond the finish line.",
    icon: Globe02Icon,
    className: "bg-environment-tint text-card-foreground border border-border",
    titleClassName: "text-3xl sm:text-3xl text-accent",
    countClassName: "text-environment",
  },
  {
    id: "categories",
    number: "MULTI",
    title: "Marathon categories",
    description:
      "A welcoming running experience for different goals and abilities.",
    icon: TelegramIcon,
    className: "bg-health-tint text-card-foreground border border-border",
    titleClassName: "text-3xl sm:text-3xl text-accent",
    countClassName: "text-health",
  },
  {
    id: "sponsors",
    number: "TOGETHER",
    title: "Sponsor partnerships",
    description: "Create meaningful brand visibility and community impact.",
    icon: HeartCheckIcon,
    className: "bg-education-tint text-card-foreground border border-border",
    titleClassName: "text-3xl sm:text-3xl text-accent",
    countClassName: "text-education",
  },
];

export const overviewStats = [
  { value: "4", label: "Race distances" },
  { value: "₹499", label: "Starting registration" },
  { value: "21.1K", label: "Longest distance" },
  { value: "100%", label: "Purpose driven" },
];
