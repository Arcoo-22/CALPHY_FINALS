"use client";

// Landing buttons. Either one marks the visit, so / skips to /learn next time.
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hasVisited, markVisited, MAIN_HREF } from "@/lib/visit";

export default function LandingActions() {
  const router = useRouter();

  // the inline script only runs on a full page load; this covers client navigation
  useEffect(() => {
    if (hasVisited()) router.replace(MAIN_HREF);
  }, [router]);

  return (
    <div className="d-flex flex-wrap gap-2">
      <Link
        href={MAIN_HREF}
        className="btn btn-flame btn-lg px-4"
        onClick={markVisited}
      >
        Start learning
      </Link>
      <Link
        href="/lessons/temperature-scales"
        className="btn btn-outline-ink btn-lg px-4"
        onClick={markVisited}
      >
        Jump into Lesson 1
      </Link>
    </div>
  );
}
