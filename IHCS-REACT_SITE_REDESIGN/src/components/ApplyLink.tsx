import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { APPLICATION_LINKS } from "../data/siteInfo";
import { isLaunchReleased } from "../data/launch";

// Every school "Apply" button. Before the LPN launch it opens the general
// Populi application directly; afterwards it opens the LPN application-choice
// modal (see ApplicationModal).
export function ApplyLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  if (isLaunchReleased) {
    return (
      <Link to="?apply=1" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={APPLICATION_LINKS.schoolApplication}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
