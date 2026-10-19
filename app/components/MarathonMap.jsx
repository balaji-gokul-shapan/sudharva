"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const route = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [
      [80.235, 13.012],
      [80.239, 13.008],
      [80.243, 13.004],
      [80.246, 12.999],
      [80.248, 12.994],
      [80.249, 12.99],
      [80.248, 12.994],
      [80.246, 12.999],
      [80.243, 13.004],
      [80.239, 13.008],
      [80.235, 13.012],
    ],
  },
};

// Demo markers only: replace with surveyed route coordinates.
const stops = [
  {
    name: "Start",
    km: "0 km",
    coordinates: [80.235, 13.012],
    color: "#16A34A",
  },
  {
    name: "Hydration Station 1",
    km: "2 km",
    coordinates: [80.243, 13.004],
    color: "#2563EB",
  },
  {
    name: "Hydration Station 2",
    km: "4 km",
    coordinates: [80.248, 12.994],
    color: "#2563EB",
  },
  {
    name: "Hydration Station 3",
    km: "6 km",
    coordinates: [80.246, 12.999],
    color: "#2563EB",
  },
  {
    name: "Hydration Station 4",
    km: "8 km",
    coordinates: [80.239, 13.008],
    color: "#2563EB",
  },
  {
    name: "Finish",
    km: "10 km",
    coordinates: [80.235, 13.012],
    color: "#DC2626",
  },
];

export default function MarathonMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [80.242, 13.002],
      zoom: 15.5,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("marathon-route", {
        type: "geojson",
        data: route,
      });

     

map.addLayer({
  id: "3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", ["get", "extrude"], "true"],
  type: "fill-extrusion",
  minzoom: 14,
  paint: {
    "fill-extrusion-color": "#B8C7D9",
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      14, 0,
      15, ["get", "height"]
    ],
    "fill-extrusion-base": [
      "coalesce",
      ["get", "min_height"],
      0
    ],
    "fill-extrusion-opacity": 0.85
  }
});



      stops.forEach((stop) => {
        const element = document.createElement("div");

        element.style.width = "18px";
        element.style.height = "18px";
        element.style.borderRadius = "50%";
        element.style.backgroundColor = stop.color;
        element.style.border = "3px solid white";
        element.style.boxShadow = "0 2px 8px #0004";
        element.style.cursor = "pointer";

        new mapboxgl.Marker({ element })
          .setLngLat(stop.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 15 }).setHTML(
              `<strong>${stop.name}</strong><br/>${stop.km}`,
            ),
          )
          .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "650px",
        borderRadius: "12px",
      }}
    />
  );
}
