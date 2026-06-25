"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  company: string;
  phone: string;
  email: string;
  requirement: string;
};

export function RequestQuoteModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset
  } = useForm<FormValues>();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-premium md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">
              Request Quote
            </p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-navy">
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

        {isSubmitSuccessful ? (
          <div className="rounded-md bg-mist p-5 text-sm leading-7 text-charcoal">
            Thank you. The inquiry has been captured in this demo experience.
            Connect the form action to your CRM, email service or WhatsApp flow for production.
          </div>
        ) : null}

        <form
          className="mt-5 grid gap-4"
          onSubmit={handleSubmit(() => undefined)}
          noValidate
        >
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
            className="mt-2 min-h-12 rounded-md bg-magenta px-5 py-3 text-sm font-semibold text-white transition hover:bg-wine"
          >
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}
