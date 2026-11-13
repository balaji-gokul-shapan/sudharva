"use client";

import { useEffect, useRef } from "react";

export function BackgroundVideo({ src, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }

      video.play().catch((error) => {
        if (
          error.name !== "NotAllowedError" &&
          error.name !== "AbortError"
        ) {
          console.error("Unable to play the decorative background video.", error);
        }
      });
    };

    syncPlayback();
    motionPreference.addEventListener("change", syncPlayback);

    return () => {
      motionPreference.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
