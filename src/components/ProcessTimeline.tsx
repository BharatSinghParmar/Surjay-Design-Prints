import { processSteps } from "@/data/site";
import { ProcessIcon } from "@/components/IconMap";
import { Stagger, StaggerItem } from "@/components/Reveal";

export function ProcessTimeline() {
  return (
    <Stagger className="relative mx-auto mt-14 max-w-5xl">
      <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-magenta via-navy/20 to-magenta md:left-1/2 md:block" />
      <div className="grid gap-6">
        {processSteps.map((step, index) => (
          <StaggerItem
            key={step.title}
            className={`relative grid gap-4 md:grid-cols-2 ${
              index % 2 === 0 ? "" : "md:[&>div:first-child]:col-start-2"
            }`}
          >
            <div
              className={`rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium ${
                index % 2 === 0 ? "md:mr-10" : "md:ml-10"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-magenta/10 text-magenta">
                  <ProcessIcon name={step.icon} />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/46">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-charcoal/72">{step.description}</p>
            </div>
          </StaggerItem>
        ))}
      </div>
    </Stagger>
  );
}
