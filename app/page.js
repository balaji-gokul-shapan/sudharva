import CTABanner from "./pages/Homepage/pages/CTABanner";
import EventCategories from "./pages/Homepage/pages/EventCategories";
import Hero from "./pages/Homepage/pages/Hero";
import Overview from "./pages/Homepage/pages/Overview";
import Partners from "./pages/Homepage/pages/Partners";
import SpecialAddons from "./pages/Homepage/pages/SpecialAddons";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata({
  title: "Sudharva Marathon",
  description:
    "Join Sudharva Marathon in Chennai to run, support diabetes awareness, and build a healthier community.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Overview />
      <EventCategories />
      <SpecialAddons />
      {/* <CarouselPage /> */}
      {/* <MarathonPage /> */}
      <Partners />
      <CTABanner />
    </>
  );
}
