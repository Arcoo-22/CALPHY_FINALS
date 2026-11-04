import { redirect } from "next/navigation";
import Landing from "@/components/Landing";
import { getSession } from "@/lib/auth";
import { MAIN_HREF } from "@/lib/visit";

export const metadata = {
  title: "Ignius · Temperature and Heat",
  description:
    "Nine short lessons on temperature and heat, each with a simulation you can drag, plus auto-graded quizzes.",
};

// First-visit landing. Returning visitors skip it: signed-in users are
// redirected here, guests by the <head> script in app/layout.jsx. The logo
// links to /welcome, which shows the same page without the redirect.
export default async function LandingPage() {
  if (await getSession()) redirect(MAIN_HREF);

  return <Landing />;
}
