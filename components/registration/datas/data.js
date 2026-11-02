import { AlertCircleIcon, FileCheckIcon, Flag01Icon, Heart, HeartCheckIcon, ActivityIcon, InformationCircle, Trophy, UserGroupIcon, CheckListIcon, Clock01Icon, ShieldCheckIcon, Award01Icon, Target01Icon } from "@animateicons/react/huge";
import { GenderFemaleIcon, GenderIntersexIcon, GenderMaleIcon } from "@phosphor-icons/react";

export const HEALTH_DECLARATIONS = [
  {
    id: "medical_fitness_declaration",
    label: "I am medically fit to participate.",
    icon: Heart,
    tint: "health",
  },
  {
    id: "physical_exertion_acknowledgement",
    label: "I understand marathon participation involves physical activity.",
    icon: Trophy,
    tint: "accent",
  },
  {
    id: "eventUpdates",
    label: "I consent to communication regarding event updates.",
    icon: InformationCircle,
    tint: "primary",
  },
  {
    id: "terms",
    label: "I agree to event terms and conditions.",
    icon: FileCheckIcon,
    tint: "education",
  },
  
];

export const DECLARATION_STYLES = {
  health: {
    selected: "border-health bg-health/5",
    icon: "bg-health/10 text-health",
  },
  accent: {
    selected: "border-accent bg-accent/5",
    icon: "bg-accent/10 text-accent",
  },
  volunteer: {
    selected: "border-volunteer bg-volunteer/5",
    icon: "bg-volunteer/10 text-volunteer",
  },
  environment: {
    selected: "border-environment bg-environment/5",
    icon: "bg-environment/10 text-environment",
  },
  primary: {
    selected: "border-primary bg-primary/5",
    icon: "bg-primary/10 text-primary",
  },
  education: {
    selected: "border-education bg-education/5",
    icon: "bg-education/10 text-education",
  },
  warning: {
    selected: "border-warning bg-warning/5",
    icon: "bg-warning/10 text-warning",
  },
  success: {
    selected: "border-success bg-success/5",
    icon: "bg-success/10 text-success",
  },
};

/**
 * SNAPSHOT_TINTS — colors for the health-snapshot chips. Every value maps to
 * a theme token in app/globals.css so the group adapts to light/dark mode.
 */
export const SNAPSHOT_TINTS = {
  neutral: {
    chip: "border-border bg-background text-ink-soft hover:border-accent/40",
    active: "border-accent/40 bg-accent/10 text-accent",
  },
  success: {
    chip: "border-border bg-background text-ink-soft hover:border-accent/40",
    active: "border-success/40 bg-success/10 text-success",
  },
  warning: {
    chip: "border-border bg-background text-ink-soft hover:border-accent/40",
    active: "border-warning/40 bg-warning/10 text-warning",
  },
  health: {
    chip: "border-border bg-background text-ink-soft hover:border-accent/40",
    active: "border-health/40 bg-health/10 text-health",
  },
  education: {
    chip: "border-border bg-background text-ink-soft hover:border-accent/40",
    active: "border-education/40 bg-education/10 text-education",
  },
  primary: {
    chip: "border-border bg-background text-ink-soft hover:border-accent/40",
    active: "border-primary/40 bg-primary/10 text-primary",
  },
};


export const HEALTH_SNAPSHOT = [
  {
    id: "previous_marathon_participation",
    kind: "toggle",
    label: "Have you participated in a marathon before?",
    icon: Flag01Icon,
    tint: "success",
    options: [
      { value: false, label: "No, this is my first", tint: "neutral" },
      { value: true, label: "Yes, I have", tint: "success" },
    ],
    hint: "First-timers get a beginner-friendly pace briefing.",
  },
  {
    id: "cardiac_condition",
    kind: "toggle",
    label: "Any diagnosed cardiac condition?",
    icon: HeartCheckIcon,
    tint: "warning",
    options: [
      { value: false, label: "No", tint: "success" },
      { value: true, label: "Yes", tint: "warning" },
    ],
    hint: "This helps our medical crew prepare the right support.",
  },
  {
    id: "hypertension",
    kind: "toggle",
    label: "Do you have hypertension (high BP)?",
    icon: ActivityIcon,
    tint: "warning",
    options: [
      { value: false, label: "No", tint: "success" },
      { value: true, label: "Yes", tint: "warning" },
    ],
    hint: "Bring your BP medication and monitor readings on race week.",
  },
  {
    id: "has_diabetes",
    kind: "toggle",
    label: "Do you have diabetes?",
    icon: ActivityIcon,
    tint: "warning",
    options: [
      { value: false, label: "No", tint: "success" },
      { value: true, label: "Yes", tint: "warning" },
    ],
    hint: "Bring your diabetes medication and monitor readings on race week.",
  },
  // {
  //   id: "eventRulesAcceptance",
  //   label: "I agree to event rules and regulations.",
  //   icon: FileCheckIcon,
  //   tint: "volunteer",
  // },
  // {
  //   id: "eventCommunicationConsent",
  //   label: "I consent to communication regarding event updates.",
  //   icon: FileCheckIcon,
  //   tint: "environment",
  // },
  // {
  //   id: "eventCommunicationConsent",
  //   label: "I consent to anonymized impact reporting.",
  //   icon: FileCheckIcon,
  //   tint: "primary",
  // },
  {
    id: "eventRulesAcceptance",
    kind: "toggle",
    label: "I agree to event rules and regulations.",
    icon: FileCheckIcon,
    tint: "volunteer",
    options: [
      { value: false, label: "No", tint: "success" },
      { value: true, label: "Yes", tint: "warning" },
    ],
    hint: "You must agree to the event rules to participate.",
  },
  {
    id: "anonymized_impact_reporting_consent",
    kind: "toggle",
    label: "I consent to anonymized impact reporting.",
    icon: FileCheckIcon,
    tint: "volunteer",
    options: [
      { value: false, label: "No", tint: "success" },
      { value: true, label: "Yes", tint: "warning" },
    ],
    hint: "You must consent to anonymized impact reporting.",
  },
  {
    id: "event_communication_consent",
    kind: "toggle",
    label: "I consent to communication regarding event updates.",
    icon: FileCheckIcon,
    tint: "volunteer",
    options: [
      { value: false, label: "No", tint: "success" },
      { value: true, label: "Yes", tint: "warning" },
    ],
    hint: "You must consent to receive event updates.",
  },
  {
    id: "allergies",
    kind: "text",
    label: "Allergies (medicines, food, dust…)",
    placeholder: "e.g. Penicillin, peanuts — or leave blank",
    icon: AlertCircleIcon,
    tint: "education",
  },
  {
    id: "other_medical_conditions",
    kind: "text",
    label: "Anything else the medical crew should know?",
    placeholder: "e.g. Asthma under control — or leave blank",
    icon: FileCheckIcon,
    tint: "primary",
  },
];

export const TEAM_SIZES = [
  { value: "1-10", label: "1–10" },
  { value: "11-25", label: "11–25" },
  { value: "26-50", label: "26–50" },
  { value: "51+", label: "51+" },
];

export const CATEGORIES = [
  {
    value: "5k",
    label: "5K Community Walk",
    detail: "Walk together, support your community.",
    distance: "5 km",
    price: 499,
    selected: "border-health bg-health/10 ring-2 ring-health/20",
    icon: "text-health",
    className: "bg-health/10"
  },
  {
    value: "05k",
    label: "5K Fun Run",
    detail: "For every pace, and every first step",
    distance: "5 km",
    price: 499,
    selected: "border-education bg-education/10 ring-2 ring-education/20",
    icon: "text-education",
    className: "bg-education/10"
  },
  {
    value: "10k",
    label: "10K Challenge Run",
    detail: "Half the distance. Double the heart",
    distance: "10 km",
    price: 799,
    selected: "border-environment bg-environment/10 ring-2 ring-environment/20",
    icon: "text-environment",
    className: "bg-environment/10"
  },
  {
    value: "21.1K Half Marathon",
    label: "21.1K Half Marathon",
    detail: "Go the distance for 589 million.",
    distance: "21.1 km",
    price: 1199,
    selected: "border-volunteer bg-volunteer/10 ring-2 ring-volunteer/20",
    icon: "text-volunteer",
    className: "bg-volunteer/10"
  },
];

export const DEFAULT_CATEGORY_META = {
  detail: "Choose your distance and run with purpose.",
  className: "border-default bg-default/10 ring-2 ring-default/20",
  iconClassName: "text-default",
  selectedClassName: "border-default bg-default/10 ring-2 ring-default/20",
};

export const CATEGORY_META_RULES = [
  {
    matches: ["walk"],
    detail: "Walk together, support your community.",
    className: "bg-health/10",
    iconClassName: "text-health",
    selectedClassName: "border-health bg-health/10 ring-2 ring-health/20",
  },
  {
    matches: ["fun run"],
    detail: "Enjoy the run and celebrate every step.",
    className: "bg-education/10",
    iconClassName: "text-education",
    selectedClassName:
      "border-education bg-education/10 ring-2 ring-education/20",
  },
  {
    matches: ["10 km", "10k"],
    detail: "Push your limits and achieve more.",
    className: "bg-environment/10",
    iconClassName: "text-environment",
    selectedClassName:
      "border-environment bg-environment/10 ring-2 ring-environment/20",
  },
  {
    matches: ["half marathon", "21.1"],
    detail: "Take on the ultimate running challenge.",
    className: "bg-volunteer/10",
    iconClassName: "text-volunteer",
    selectedClassName:
      "border-volunteer bg-volunteer/10 ring-2 ring-volunteer/20",
  },
];

export const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const GENDERS = [
  { value: "male", label: "Male", icon: GenderMaleIcon },
  { value: "female", label: "Female", icon: GenderFemaleIcon },
  { value: "other", label: "Prefer not to say", icon: GenderIntersexIcon },
];


/* ------------------------------------------------------------------ */
/*  Rules data                                                         */
/* ------------------------------------------------------------------ */
export const RULE_SECTIONS = [
  {
    id: "eligibility",
    title: "Eligibility",
    icon: UserGroupIcon,
    color: "var(--brand-volunteer)",
    tint: "var(--brand-volunteer-tint)",
    rules: [
      "Open to all participants aged 16 years and above.",
      "Participants below 18 must submit a signed parental consent form.",
      "Each runner must register individually — group registrations are not permitted.",
      "Participants with known medical conditions must carry a doctor's clearance certificate.",
    ],
  },
  {
    id: "registration",
    title: "Registration",
    icon: CheckListIcon,
    color: "var(--brand-health)",
    tint: "var(--brand-health-tint)",
    rules: [
      "Registration closes 48 hours before race day or when slots are filled, whichever is earlier.",
      "Entry fees are non-refundable and non-transferable.",
      "A valid government-issued photo ID is mandatory for bib collection.",
      "Each participant may register for only one category.",
      "BIB collection is mandatory the day before the event at the designated venue.",
    ],
  },
  {
    id: "race-day",
    title: "Race Day Rules",
    icon: ActivityIcon,
    color: "var(--brand-environment)",
    tint: "var(--brand-environment-tint)",
    rules: [
      "Participants must reach the start zone at least 30 minutes before flag-off.",
      "Wearing the official event BIB on the front of the body is mandatory throughout the race.",
      "Running with pets, prams, cycles, or skates is strictly prohibited.",
      "Headphones are discouraged. Single-ear or bone-conduction devices are allowed.",
      "Participants must follow the designated course and not take shortcuts.",
      "Outside pacing or assistance from unregistered persons is not permitted.",
    ],
  },
  {
    id: "timing",
    title: "Timing & Cut-offs",
    icon: Clock01Icon,
    color: "var(--brand-education)",
    tint: "var(--brand-education-tint)",
    rules: [
      "Chip timing will be used for all categories. Results are based on gun time.",
      "5K Community Walk: 1.5 hour cut-off from flag-off.",
      "5K Fun Run: 1.5 hour cut-off from flag-off.",
      "10K Challenge Run: 2 hour cut-off from flag-off.",
      "21.1K Half Marathon: 3.5 hour cut-off from flag-off.",
      "Participants exceeding the cut-off will be requested to board the sweep vehicle.",
    ],
  },
  {
    id: "health-safety",
    title: "Health & Safety",
    icon: HeartCheckIcon,
    color: "var(--brand-volunteer)",
    tint: "var(--brand-volunteer-tint)",
    rules: [
      "Medical aid stations and first-aid teams will be stationed every 2 km.",
      "Hydration stations will be placed at regular intervals along the route.",
      "Participants must report any health emergency to the nearest marshal immediately.",
      "Organisers reserve the right to withdraw a participant if deemed medically unfit.",
      "In extreme weather, the event may be delayed or modified for participant safety.",
    ],
  },
  {
    id: "conduct",
    title: "Code of Conduct",
    icon: ShieldCheckIcon,
    color: "var(--brand-health)",
    tint: "var(--brand-health-tint)",
    rules: [
      "Behave respectfully towards fellow runners, volunteers, and officials at all times.",
      "Any harassment, discrimination, or unsportsmanlike behaviour leads to disqualification.",
      "Littering outside designated zones will result in immediate disqualification.",
      "Race officials' decisions are final and binding.",
      "Participants who damage or misuse event property will be held liable.",
    ],
  },
  {
    id: "finishers",
    title: "Finishers & Awards",
    icon: Award01Icon,
    color: "var(--brand-environment)",
    tint: "var(--brand-environment-tint)",
    rules: [
      "All finishers will receive an official finisher medal at the finish line.",
      "E-certificates will be emailed within 7 working days after the event.",
      "Category winners will be announced at the post-race ceremony.",
      "Prize winners must be present at the ceremony — no proxies are allowed.",
      "Official results will be published on the website within 24 hours of the event.",
    ],
  },
  {
    id: "disqualification",
    title: "Disqualification",
    icon: Target01Icon,
    color: "var(--brand-education)",
    tint: "var(--brand-education-tint)",
    rules: [
      "Use of performance-enhancing substances is strictly prohibited.",
      "Runners must complete the entire course on foot within the designated route.",
      "BIB transfer, sharing, or defacement is grounds for immediate disqualification.",
      "Fraudulent registration or misrepresentation of personal details.",
      "Failure to comply with instructions from race officials or marshals.",
    ],
  },
];

export const PRIZE_ROWS = [
  { id: "u17-male", category: "6yrs - 17yrs - Male", prize1: 5000, prize2: 3000, prize3: 2000 },
  { id: "u17-female", category: "6yrs - 17yrs - Female", prize1: 5000, prize2: 3000, prize3: 2000 },
  { id: "adult-male", category: "18yrs - 50yrs - Male", prize1: 5000, prize2: 3000, prize3: 2000 },
  { id: "adult-female", category: "18yrs - 45yrs - Female", prize1: 5000, prize2: 3000, prize3: 2000 },
  { id: "senior-male", category: "Above 50yrs - Male", prize1: 5000, prize2: 3000, prize3: 2000 },
  { id: "senior-female", category: "Above 45yrs - Female", prize1: 5000, prize2: 3000, prize3: 2000 },
];
