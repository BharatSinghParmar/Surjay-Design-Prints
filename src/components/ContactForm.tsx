"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

type ContactValues = {
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

const formSubmitEndpoint = "https://formsubmit.co/ajax/droptomindspark@gmail.com";

export function ContactForm() {
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactValues>();

  async function onSubmit(values: ContactValues) {
    setSubmitMessage(null);

    try {
      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          _subject: `New inquiry from ${values.name} - ${values.service}`,
          _template: "table",
          _captcha: "false",
          ...values
        })
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "Unable to send inquiry. Please try again.");
      }

      reset();
      setSubmitMessage({
        type: "success",
        text: "Thank you. Your inquiry has been sent successfully."
      });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to send inquiry. Please try again."
      });
    }
  }

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-premium md:p-8"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">Inquiry Form</p>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-navy">Start a conversation</h2>
      {submitMessage ? (
        <p
          className={`mt-4 rounded-md p-4 text-sm ${
            submitMessage.type === "success" ? "bg-mist text-charcoal/75" : "bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {submitMessage.text}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input autoComplete="name" className="input" {...register("name", { required: "Name is required" })} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input autoComplete="organization" className="input" {...register("company", { required: "Company is required" })} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" className="input" {...register("phone", { required: "Phone is required" })} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            className="input"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" }
            })}
          />
        </Field>
      </div>
      <Field label="Service" error={errors.service?.message} className="mt-4">
        <select className="input" {...register("service", { required: "Select a service" })}>
          <option value="">Select requirement</option>
          <option>Fabric dyeing</option>
          <option>Screen printing</option>
          <option>Hand printing</option>
          <option>Textile finishing</option>
          <option>Bulk manufacturing</option>
        </select>
      </Field>
      <Field label="Message" error={errors.message?.message} className="mt-4">
        <textarea
          rows={5}
          className="input"
          {...register("message", { required: "Message is required" })}
        />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 min-h-12 w-full rounded-md bg-magenta px-5 py-3 text-sm font-semibold text-white transition hover:bg-wine"
      >
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className = ""
}: {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-navy ${className}`}>
      {label}
      {children}
      {error ? <span className="text-xs text-magenta">{error}</span> : null}
    </label>
  );
}
