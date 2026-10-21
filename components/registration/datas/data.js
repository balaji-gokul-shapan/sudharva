import { AlertCircleIcon, FileCheckIcon, Flag01Icon, Heart, HeartCheckIcon, ActivityIcon, InformationCircle, Trophy } from "@animateicons/react/huge";
import { GenderFemaleIcon, GenderIntersexIcon, GenderMaleIcon } from "@phosphor-icons/react";

export const HEALTH_DECLARATIONS = [
  {
    id: "medicallyFit",
    label: "I am medically fit to participate.",
    icon: Heart,
    tint: "health",
  },
  {
    id: "physicalActivity",
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

export const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const GENDERS = [
  { value: "male", label: "Male", icon: GenderMaleIcon },
  { value: "female", label: "Female", icon: GenderFemaleIcon },
  { value: "other", label: "Prefer not to say", icon: GenderIntersexIcon },
];
