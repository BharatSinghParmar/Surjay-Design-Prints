import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { productCategories } from "@/data/site";
import { Stagger, StaggerItem } from "@/components/Reveal";

export function ProductCards() {
  return (
    <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
      {productCategories.map((product) => (
        <StaggerItem key={product.title} className="group overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden bg-mist">
            <Image
              src={product.image}
              alt={`${product.title} by Surjay Design & Prints`}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div className="p-6">
            <h3 className="font-heading text-2xl font-semibold text-navy">{product.title}</h3>
            <p className="mt-3 text-sm leading-7 text-charcoal/72">{product.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.applications.map((application) => (
                <span
                  key={application}
                  className="rounded-md bg-mist px-3 py-2 text-xs font-semibold text-charcoal/70"
                >
                  {application}
                </span>
              ))}
            </div>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-magenta"
            >
              Send Product Inquiry
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
