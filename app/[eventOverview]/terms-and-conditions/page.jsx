import { termsSections } from "@/app/datas/events/data";
import TermsExperience from "./TermsExperience";

export function generateStaticParams() {
  return [{ eventOverview: "event" }];
}

export default function TermsAndConditionsPage() {
  return <TermsExperience termsSections={termsSections} />;
}