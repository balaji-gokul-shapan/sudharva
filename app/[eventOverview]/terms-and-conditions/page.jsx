import { termsSections } from "@/app/datas/events/data";
import TermsExperience from "./TermsExperience";

export const metadata = {
  title: "Terms & Conditions | Sudharva Marathon 2025",
  description:
    "Terms and Conditions for participation, registration, payments, and race-day conduct at Sudharva Marathon 2025.",
};



export default function TermsAndConditionsPage() {
  return <TermsExperience termsSections={termsSections} />;
}