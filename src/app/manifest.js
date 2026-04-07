/** @type {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    name: "OMNIX — Galaxy AI Assistant",
    short_name: "OMNIX",
    description:
      "OMNIX is a world-class AI assistant. Ask anything, build anything.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    orientation: "portrait-primary",
    background_color: "#050816",
    theme_color: "#040818",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icons/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
