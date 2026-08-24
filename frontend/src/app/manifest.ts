import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Namma Bites",
    short_name: "NammaBites",
    description: "Small-batch South Indian snacks, delivered fresh.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9f0",
    theme_color: "#e95322",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
