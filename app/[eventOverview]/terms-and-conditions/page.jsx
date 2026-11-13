import { termsSections } from "@/app/datas/events/data";
import TermsExperience from "./TermsExperience";

export function generateStaticParams() {
  return [{ eventOverview: "event" }];
}

export const metadata = {
  title: "Terms & Conditions | Sudharva Marathon 2027",
  description:
    "Terms and Conditions for participation, registration, payments, and race-day conduct at Sudharva Marathon 2027.",
};

export default function TermsAndConditionsPage() {
  return <TermsExperience termsSections={termsSections} />;
}