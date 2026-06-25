"use client";

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

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset
  } = useForm<ContactValues>();

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-premium md:p-8"
      onSubmit={handleSubmit(() => reset())}
      noValidate
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">Inquiry Form</p>
      <h2 className="mt-3 font-heading text-3xl font-semibold text-navy">Start a conversation</h2>
      {isSubmitSuccessful ? (
        <p className="mt-4 rounded-md bg-mist p-4 text-sm text-charcoal/75">
          Thank you. This demo captured the form state successfully.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className="input" {...register("name", { required: "Name is required" })} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input className="input" {...register("company", { required: "Company is required" })} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="input" {...register("phone", { required: "Phone is required" })} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
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
        className="mt-6 min-h-12 w-full rounded-md bg-magenta px-5 py-3 text-sm font-semibold text-white transition hover:bg-wine"
      >
        Submit Inquiry
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
