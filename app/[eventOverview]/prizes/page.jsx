import React from "react";
import PrizesHero from "./pages/PrizesHero";

export function generateStaticParams() {
  return [{ eventOverview: "event" }];
}

export const metadata = {
  title: "Prizes | Sudharva Marathon 2027",
  description:
    "Explore the awards and prizes available to participants in Sudharva Marathon 2027.",
};

const Page = () => {
  return (
    <div>
      <PrizesHero />
    </div>
  );
};

export default Page;
