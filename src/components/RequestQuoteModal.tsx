"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  company: string;
  phone: string;
  email: string;
  requirement: string;
  website?: string; // honeypot
};

export function RequestQuoteModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>();

  // Lock background scroll, close on Escape, keep focus inside, restore on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the dialog
    const timer = window.setTimeout(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>("input:not([aria-hidden]), button")
        ?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  // Reset transient state each time the modal is opened
  useEffect(() => {
    if (open) {
      setSent(false);
      setError("");
    }
  }, [open]);

  async function onSubmit(values: FormValues) {
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "quote", ...values })
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Unable to send your request. Please try again.");
      reset();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your request.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-quote-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 shadow-premium md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">
              Request Quote
            </p>
            <h2 id="request-quote-title" className="mt-2 font-heading text-2xl font-semibold text-navy">
              Share your fabric requirement
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close request quote"
            onClick={onClose}
            className="rounded-md border border-slate-200 p-2 text-navy transition hover:border-magenta hover:text-magenta"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div role="status" aria-live="polite">
          {sent ? (
            <div className="rounded-md bg-mist p-5 text-sm leading-7 text-charcoal">
              <strong className="font-semibold text-navy">Thank you — your request has been sent.</strong>
              <br />
              Our team will get back to you shortly. For anything urgent, message us on WhatsApp.
            </div>
          ) : null}
          {error ? (
            <div className="rounded-md bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</div>
          ) : null}
        </div>

        <form
          className="mt-5 grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Honeypot — hidden from humans */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            {...register("website")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Name
              <input
                className="rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name ? <span className="text-xs text-magenta">{errors.name.message}</span> : null}
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Company
              <input
                className="rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
                {...register("company", { required: "Company is required" })}
              />
              {errors.company ? (
                <span className="text-xs text-magenta">{errors.company.message}</span>
              ) : null}
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Phone
              <input
                className="rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone ? <span className="text-xs text-magenta">{errors.phone.message}</span> : null}
            </label>
            <label className="grid gap-2 text-sm font-semibold text-navy">
              Email
              <input
                type="email"
                className="rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email"
                  }
                })}
              />
              {errors.email ? <span className="text-xs text-magenta">{errors.email.message}</span> : null}
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Requirement
            <textarea
              rows={4}
              className="rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
              {...register("requirement", { required: "Requirement is required" })}
            />
            {errors.requirement ? (
              <span className="text-xs text-magenta">{errors.requirement.message}</span>
            ) : null}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 min-h-12 rounded-md bg-magenta px-5 py-3 text-sm font-semibold text-white transition hover:bg-wine disabled:opacity-60"
          >
            {isSubmitting ? "Sending…" : "Send Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
