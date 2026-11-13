import React from "react";
import PrizesHero from "./pages/PrizesHero";
import { createPageMetadata } from "../../seo";

export async function generateMetadata({ params }) {
  const { eventOverview } = await params;

  return createPageMetadata({
    title: "Prizes | Sudharva Marathon 2027",
    description:
      "Explore the awards and prizes available to participants in Sudharva Marathon 2027.",
    path: `/${eventOverview}/prizes`,
  });
}

const Page = () => {
  return (
    <div>
      <PrizesHero />
    </div>
  );
};

export default Page;
