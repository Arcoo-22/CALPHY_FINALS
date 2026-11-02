import Landing from "@/components/Landing";

export const metadata = {
  title: "Welcome",
  description:
    "Nine short lessons on temperature and heat, each with a simulation you can drag, plus auto-graded quizzes.",
  alternates: { canonical: "/" },
};

// The landing, always reachable from the logo, even for returning visitors.
export default function WelcomePage() {
  return <Landing stay />;
}
