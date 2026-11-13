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
  { value: "3", label: "Race distances" },
  { value: "₹499", label: "Starting registration" },
  { value: "21.1K", label: "Longest distance" },
  { value: "100%", label: "Purpose driven" },
];

export const termsSections = [
  {
    title: "1. Acceptance of Terms",
    points: [
      "By registering for or participating in Sudharva Marathon 2025, you agree to these Terms and Conditions.",
      "If you are registering on behalf of another participant, you confirm that you are authorized to accept these terms for that participant.",
      "Organizers may update these terms when required. The latest version published on this website will apply.",
    ],
  },
  {
    title: "2. Eligibility and Registration",
    points: [
      "Participants must provide accurate and complete details during registration.",
      "Participants below 18 years of age must have consent from a parent or legal guardian.",
      "Registrations are confirmed only after successful payment and issuance of a confirmation message or receipt.",
      "Organizers reserve the right to verify identity and age at any stage.",
    ],
  },
  {
    title: "3. Health and Fitness Declaration",
    points: [
      "You confirm that you are medically fit to participate in the selected category.",
      "You are responsible for consulting a qualified medical professional before participating if needed.",
      "Participants with known medical conditions must carry required medication and emergency information.",
      "Organizers may deny participation to anyone who appears medically unfit or unsafe to continue.",
    ],
  },
  {
    title: "4. Race Rules and Conduct",
    points: [
      "Participants must follow instructions from race officials, volunteers, route marshals, and medical teams.",
      "Use of unauthorized vehicles, dangerous behavior, and route shortcuts are prohibited.",
      "Any participant engaging in abusive, discriminatory, or unsafe conduct may be disqualified and removed.",
      "Bibs and event IDs are personal and non-transferable unless explicitly permitted by organizers.",
    ],
  },
  {
    title: "5. Event Changes, Delays, and Cancellations",
    points: [
      "Organizers may modify route, schedule, start time, race format, or event arrangements for safety, legal, logistical, or weather-related reasons.",
      "In case of force majeure events, including natural disasters, public health emergencies, civil unrest, or government restrictions, the event may be postponed, modified, or canceled.",
      "Any rescheduling, transfer policy, or refund handling will be communicated through official channels.",
    ],
  },
  {
    title: "6. Fees, Refunds, and Transfers",
    points: [
      "Registration fees are generally non-refundable unless a specific refund policy is announced for a category or situation.",
      "Convenience fees, payment gateway charges, and taxes may be non-refundable.",
      "Category change, transfer, or deferral requests are subject to organizer approval and applicable deadlines.",
    ],
  },
  {
    title: "7. Timing, Results, and Awards",
    points: [
      "Official results are based on organizer-approved timing systems and rules.",
      "Organizers reserve the right to review, correct, or revise results in case of technical or rule-related issues.",
      "Awards and prize eligibility are subject to category rules, verification checks, and anti-fraud review.",
    ],
  },
  {
    title: "8. Media Consent",
    points: [
      "Participants may be photographed, filmed, or recorded during the event.",
      "By participating, you grant organizers and authorized partners the right to use such media for event communication, promotion, and archival purposes without additional compensation.",
      "If legally required in specific contexts, withdrawal or restricted-use requests may be handled as per applicable law.",
    ],
  },
  {
    title: "9. Personal Data",
    points: [
      "Personal information collected during registration is used for event operations, communication, support, compliance, and participant services.",
      "Data may be shared with trusted operational partners such as timing, medical, logistics, and payment providers only as required for event delivery and compliance.",
      "Participants are responsible for providing current contact details for critical updates.",
    ],
  },
  {
    title: "10. Liability and Indemnity",
    points: [
      "Participation is voluntary and at your own risk.",
      "To the maximum extent permitted by law, organizers are not liable for personal injury, loss, damage, or theft arising from participation except where liability cannot legally be excluded.",
      "You agree to indemnify organizers against claims arising from your negligent, unlawful, or willfully harmful actions during the event.",
    ],
  },
  {
    title: "11. Prohibited Items and Safety",
    points: [
      "Participants must not carry prohibited or dangerous items, including weapons, explosives, illegal substances, or any item deemed unsafe by security personnel.",
      "Security checks may be conducted at expo and race venues.",
      "Refusal to comply with safety checks can result in denied entry without refund.",
    ],
  },
  {
    title: "12. Governing Law and Dispute Resolution",
    points: [
      "These terms are governed by applicable laws of India.",
      "Courts with competent jurisdiction at the organizer's principal place of operations will have jurisdiction, unless otherwise required by law.",
      "Before formal legal action, participants agree to attempt good-faith resolution through written communication with the organizers.",
    ],
  },
];
