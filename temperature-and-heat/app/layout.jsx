import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { UserProvider } from "@/components/UserContext";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: {
    default: "CalphyLearn · Temperature and Heat",
    template: "%s · CalphyLearn",
  },
  description:
    "An interactive Physics learning platform: animated tutorials, canvas simulations, quizzes and a friendly mascot, covering Temperature and Heat.",
  keywords: [
    "physics",
    "temperature",
    "heat",
    "thermodynamics",
    "simulations",
    "quiz",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F7F4",
};

const themeInit = `(function(){try{var saved=localStorage.getItem("calphy-theme");var theme=saved||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.dataset.theme=theme}catch(e){document.documentElement.dataset.theme="light"}})()`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* root App Router layout, so the font loads on every page; this rule
            targets the old pages/ router */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      {/* extensions such as Grammarly add attributes to <body> before React
          hydrates; this ignores attribute mismatches on <body> only */}
      <body suppressHydrationWarning>
        <UserProvider>
          <SiteNavbar />
          <main>{children}</main>
          <SiteFooter />
        </UserProvider>
      </body>
    </html>
  );
}
