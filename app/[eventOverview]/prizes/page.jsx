import React from "react";
import PrizesHero from "./pages/PrizesHero";

export function generateStaticParams() {
  return [{ eventOverview: "event" }];
}

const Page = () => {
  return (
    <div>
      <PrizesHero />
    </div>
  );
};

export default Page;
