import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: Array<{ name: string; href: string }> }) {
  return (
    <nav className="mx-auto max-w-7xl px-4 py-5 text-sm sm:px-6 lg:px-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-charcoal/62">
        <li>
          <Link href="/" className="transition hover:text-magenta">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <Link href={item.href} className="font-medium text-navy transition hover:text-magenta">
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
