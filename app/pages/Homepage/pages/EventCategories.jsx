import { GridPattern } from "@/components/animation/GridPattern";

import {
  EventsBackground,
  EventsHeroHeader,
  EventsStrip,
} from "./EventCategoriesAnimations";
import { EventsResponsiveGrid } from "./EventCategoriesRail";
import { eventCategoriesData } from "../../../datas/homepage/data";

const EventCategories = () => {
  return (
    <section
      id="event-categories"
      aria-labelledby="event-categories-heading"
      className="relative overflow-x-clip bg-bg text-[var(--color-ink)]"
    >
      {/* ---- Decorative layers (GSAP drift island + static art) ---- */}
      <EventsBackground />
      <div className="events-sunburst pointer-events-none" aria-hidden="true" />
      <div className="events-scanline pointer-events-none" aria-hidden="true" />
      <GridPattern
        squares={[
          [24, 2],
          [12, 2],
          [32, 2],
          [27, 4],
          [22, 5],
          [28, 22],
          [5, 23],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
        ]}
        className="[mask-image:radial-gradient(700px_circle_at_50%_15%,white,transparent)]"
      />

      <div className="container-page relative z-10 py-14 sm:py-20">
        {/* ---- Header (hero-style island) ---- */}
        <header className="contents">
          <EventsHeroHeader />
        </header>

        {/* ---- Category cards ---- */}
        {/* Desktop (lg+): regular grid · Mobile/Tablet: pinned horizontal rail */}
        <EventsResponsiveGrid items={eventCategoriesData} />

        {/* ---- Interactive category strip (stateful island) ---- */}
        <EventsStrip
          items={eventCategoriesData}
          defaultKey={eventCategoriesData.key}
        />
      </div>
    </section>
  );
};

export default EventCategories;
