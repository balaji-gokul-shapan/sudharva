import { createPageMetadata } from "../seo";
import PartnerShowcase from "./PartnerShowcase";

export const metadata = createPageMetadata({
  title: "Partners | Sudharva Marathon",
  description:
    "Support Sudharva Marathon through tiered sponsorships: Gold, Silver, Bronze, and community contribution tracks.",
  path: "/partners",
});

export default function PartnersPage() {
  return <PartnerShowcase />;
}
