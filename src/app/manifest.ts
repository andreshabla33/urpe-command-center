import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "URPE Command Center",
    short_name: "URPE",
    description:
      "Numero 18 Operations Division. Single pane of glass para operar el ecosistema URPE en tiempo real.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a1f44",
    theme_color: "#0a1f44",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    categories: ["productivity", "business"],
    lang: "es",
  };
}
