import { HexagonPattern } from "@/components/animation/HexagonalPattern";
import { cn } from "@/lib/utils";

import {
  AddonsBackground,
  AddonsIntro,
  AddonsPill,
  AddonsTicket,
  ShareHealthCard,
} from "./SpecialAddonsAnimations";
import { addonData, extraAddonData } from "../../../datas/homepage/data";

const SpecialAddons = () => {
  return (
    <section
      id="special-addons"
      aria-labelledby="special-addons-heading"
      className="relative overflow-hidden bg-bg text-[var(--color-ink)]"
    >
      {/* ---- Decorative layers (GSAP drift island + static art) ---- */}
      <AddonsBackground />

      <HexagonPattern
        hexagons={[
          [1, 1],
          [4, 4],
          [2, 2],
          [3, 4],
          [45, 4],
          [8, 32],
          [26, 3],
          [8, 5],
          [10, 10],
        ]}
        className={cn(
          "mask-[radial-gradient(520px_circle_at_center,white,transparent)]",
          "inset-0 skew-y-6",
        )}
      />
      <div className="container-page relative z-10 py-14 sm:py-20">
        <AddonsPill />
        <div
          id="special-addons-heading"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2"
        >
          <div>
            <AddonsIntro items={addonData} />
          </div>
          <div className="flex flex-col gap-4">
            <ShareHealthCard items={extraAddonData} />
            {/* <AddonsTicket /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialAddons;
