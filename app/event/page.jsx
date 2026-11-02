import EventHero from "./EventHero";
import EventCategoriesSection from "./EventCategoriesSection";
import EventPrizesSection from "./EventPrizesSection";
import EventOverviewSection from "./EventOverviewSection";
import EventMotto from "./EventMotto";
import HorizontalScrollCards from "./HorizontalScrollCards";

export const metadata = {
  title: "Events — Sudharva Marathon",
  description:
    "Choose your distance — 5K Community Walk, 5K Fun Run, 10K Challenge, or 21.1K Half Marathon. Register now and run for a diabetes-free India.",
};

export default function EventPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <EventHero />
      <EventMotto/>
      <HorizontalScrollCards />
      <EventOverviewSection /> 
      <EventCategoriesSection />
      <EventPrizesSection />
    </main>
  );
}
