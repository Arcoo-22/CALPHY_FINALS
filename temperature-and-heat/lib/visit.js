// First-visit flag: the landing page (/) shows once, after that
// visitors go straight to /learn. Saved progress also counts as a visit,
// so people who used the site before the landing existed skip it too.
import { LS_KEY } from "@/lib/progress";

export const VISITED_KEY = "calphy_visited";
export const MAIN_HREF = "/learn";

export function hasVisited() {
  try {
    return Boolean(
      localStorage.getItem(VISITED_KEY) || localStorage.getItem(LS_KEY),
    );
  } catch {
    return false;
  }
}

export function markVisited() {
  try {
    localStorage.setItem(VISITED_KEY, "1");
  } catch {
    /* private mode, the landing just shows again next time */
  }
}

// Runs in <head> before the landing paints (only acts on /).
export const returningRedirectScript = `(function(){try{if(location.pathname==="/"&&(localStorage.getItem("${VISITED_KEY}")||localStorage.getItem("${LS_KEY}")))location.replace("${MAIN_HREF}")}catch(e){}})()`;
