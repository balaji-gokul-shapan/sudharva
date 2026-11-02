import CTABanner from "./pages/Homepage/pages/CTABanner";
import EventCategories from "./pages/Homepage/pages/EventCategories";
import Hero from "./pages/Homepage/pages/Hero";
import Overview from "./pages/Homepage/pages/Overview";
import Partners from "./pages/Homepage/pages/Partners";
import SpecialAddons from "./pages/Homepage/pages/SpecialAddons";


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
