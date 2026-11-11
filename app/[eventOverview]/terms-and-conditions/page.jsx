import { termsSections } from "@/app/datas/events/data";
import TermsExperience from "./TermsExperience";
import { createPageMetadata } from "../../seo";

export async function generateMetadata({ params }) {
  const { eventOverview } = await params;

  return createPageMetadata({
    title: "Terms & Conditions | Sudharva Marathon 2027",
    description:
      "Terms and Conditions for participation, registration, payments, and race-day conduct at Sudharva Marathon 2027.",
    path: `/${eventOverview}/terms-and-conditions`,
  });
}

export default function TermsAndConditionsPage() {
  return <TermsExperience termsSections={termsSections} />;
}