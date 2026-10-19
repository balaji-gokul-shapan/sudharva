import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselIndicators,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import Image from "next/image";
import React from "react";
import { SLIDES } from "../datas/homepage/data";



const CarouselPage = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="container-page mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Event Gallery
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Glimpses from the Sudharva Marathon - every stride counts.
          </p>
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <Carousel
            opts={{ align: "start", loop: true }}
            autoPlay
            autoPlayInterval={3000}
            className="group"
            label="Sudharva Marathon event gallery"
          >
            <CarouselContent>
              {SLIDES.map((slide, idx) => (
                <CarouselItem key={slide.heading} className="relative h-[19rem] overflow-hidden rounded-2xl sm:h-[26rem] lg:h-[32rem]">
                  <Image
                    fill
                    src={slide.src}
                    alt={slide.alt}
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1120px"
                    className="object-cover object-center"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {slide.heading}
                    </h3>
                    <p className="mt-2 text-sm text-white/90 sm:text-base">
                      {slide.caption}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="z-20 left-3 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white sm:left-5" />
            <CarouselNext className="z-20 right-3 border-white/40 bg-black/30 text-white hover:bg-black/50 hover:text-white sm:right-5" />
            <CarouselIndicators className="absolute inset-x-0 bottom-5 z-20" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CarouselPage;

