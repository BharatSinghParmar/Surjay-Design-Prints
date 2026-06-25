import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: ButtonLinkProps) {
  const styles = {
    primary:
      "bg-magenta text-white shadow-premium hover:bg-wine focus-visible:outline-magenta",
    secondary:
      "border border-navy/15 bg-white text-navy hover:border-magenta hover:text-magenta focus-visible:outline-magenta",
    light:
      "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-navy focus-visible:outline-white"
  };

  return (
    <Link
      href={href}
      className={`group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-md px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles[variant]} ${className}`}
    >
      <span className="absolute inset-0 scale-0 rounded-full bg-white/20 transition duration-500 group-hover:scale-150" />
      <span className="relative">{children}</span>
    </Link>
  );
}
