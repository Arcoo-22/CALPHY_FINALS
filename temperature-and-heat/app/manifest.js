export default function manifest() {
  return {
    name: "Ignius · Temperature and Heat",
    short_name: "Ignius",
    description:
      "An interactive Physics learning platform covering Temperature and Heat.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F7F4",
    theme_color: "#F8F7F4",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
