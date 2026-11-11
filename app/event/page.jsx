import EventHero from "./EventHero";
import EventCategoriesSection from "./EventCategoriesSection";
import EventPrizesSection from "./EventPrizesSection";
import EventOverviewSection from "./EventOverviewSection";
import EventMotto from "./EventMotto";
import HorizontalScrollCards from "./HorizontalScrollCards";
import { createPageMetadata, SITE_URL } from "../seo";

const event = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Sudharva Marathon 2027",
  description:
    "A community-focused marathon in Chennai promoting running, diabetes awareness, early detection, and healthier living.",
  startDate: "2027-01-24",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Ajeya Stadium",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Avadi",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  },
  image: [`${SITE_URL}/image/cta/events/event_hero.webp`],
  organizer: {
    "@id": `${SITE_URL}/#organization`,
  },
  url: `${SITE_URL}/event`,
};

const eventJsonLd = JSON.stringify(event).replace(/</g, "\\u003c");

export const metadata = createPageMetadata({
  title: "Events - Sudharva Marathon",
  description:
    "Choose your distance - 5K Community Walk, 5K Fun Run, 10K Challenge, or 21.1K Half Marathon. Register now and run for a diabetes-free India.",
  path: "/event",
});

export default function EventPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: eventJsonLd }}
      />
      <main className="min-h-screen bg-background text-foreground">
        <EventHero />
        <EventMotto />
        <HorizontalScrollCards />
        <EventOverviewSection />
        <EventCategoriesSection />
        <EventPrizesSection />
      </main>
    </>
  );
}
