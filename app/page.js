import Hero from "./pages/Hero";
import CTABanner from "./pages/CTABanner";
import Overview from "./pages/Overview";
import MarathonPage from "./pages/Route";
import EventCategories from "./pages/EventCategories";
import SpecialAddons from "./pages/SpecialAddons";
import Partners from "./pages/Partners";
import CarouselPage from "./pages/Carousel";

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
