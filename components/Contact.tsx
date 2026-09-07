"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const update = (field: keyof FormState) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.subject.trim()) next.subject = "Add a short subject.";
    if (form.message.trim().length < 12) {
      next.message = "Tell me a bit more about the project.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      "",
      form.message.trim(),
    ].join("\n");

    window.location.href = `mailto:hello@madworm.dev?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => {
      setStatus("sent");
      setForm(emptyForm);
    }, 400);
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <div className="rounded-[2rem] border border-line bg-surface px-6 py-10 shadow-sm backdrop-blur-md sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-violet-500">
            GET IN TOUCH
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Let’s create something <span className="text-gradient">amazing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Have an AI product, a messy full-stack rebuild, or a team that needs
            a builder who can own the whole path? Send a note and I’ll get back
            to you.
          </p>
        </div>

        {status === "sent" ? (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-violet-200 bg-violet-50 px-6 py-8 text-center dark:border-violet-500/30 dark:bg-violet-500/10">
            <p className="text-lg font-semibold text-ink">Message ready to send</p>
            <p className="mt-2 text-sm text-muted">
              Your email app should be open with the note filled in. If it didn’t,
              write me at hello@madworm.dev.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 text-sm font-semibold text-violet-600 dark:text-violet-300"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-10 grid max-w-2xl gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={update("name")}
                error={errors.name}
                placeholder="Your name"
                autoComplete="name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <Field
              label="Subject"
              value={form.subject}
              onChange={update("subject")}
              error={errors.subject}
              placeholder="What should we build?"
            />
            <Field
              label="Message"
              value={form.message}
              onChange={update("message")}
              error={errors.message}
              placeholder="Tell me about the product, timeline, and what success looks like."
              textarea
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-shine mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send className="h-4 w-4" />
              {status === "sending" ? "Opening mail…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  textarea = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  const classes = `w-full rounded-2xl border bg-background/70 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 ${
    error ? "border-rose-400" : "border-line"
  }`;

  return (
    <label className="block text-left">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      {textarea ? (
        <textarea
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${classes} resize-y min-h-32`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={classes}
        />
      )}
      {error && <span className="mt-1.5 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}
