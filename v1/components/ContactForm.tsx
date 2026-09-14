"use client";

import { useId, useRef, useState } from "react";
import { site } from "@/content/site";

/* ============================================================================
   CONTACT FORM

   Replaces a published mailto: address. The visitor types, the form posts to
   Formspree, Formspree emails Harshith. His address is never in the page
   source, so there is nothing for a scraper to harvest.

   Set the endpoint in content/site.ts. Until it is set this renders nothing
   and the Contact section falls back to links alone — an unconfigured form
   that silently swallows messages would be worse than no form.
   ========================================================================== */

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const endpoint = site.contact.form.endpoint;
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  if (!endpoint) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real people never fill a field they cannot see. Pretend it
    // worked so a bot has nothing to learn from the response.
    if (data.get("company")) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  const field =
    "w-full border-b border-white/20 bg-transparent py-3 text-white " +
    "transition-colors duration-300 placeholder:text-white/30 " +
    "hover:border-white/40 focus:border-blue focus:outline-none " +
    "disabled:opacity-50";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="mt-[clamp(2.5rem,6vw,4rem)] max-w-[42rem]"
    >
      <div className="flex flex-col gap-7 sm:flex-row sm:gap-8">
        <div className="flex-1">
          <label htmlFor={`${id}-name`} className="t-micro dimmer mb-2 block">
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={sending}
            className={`t-body ${field}`}
          />
        </div>

        <div className="flex-1">
          <label htmlFor={`${id}-email`} className="t-micro dimmer mb-2 block">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={sending}
            className={`t-body ${field}`}
          />
        </div>
      </div>

      <div className="mt-7">
        <label htmlFor={`${id}-message`} className="t-micro dimmer mb-2 block">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={4}
          disabled={sending}
          className={`t-body resize-y ${field}`}
        />
      </div>

      {/* Hidden from people and from assistive tech; visible to naive bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
        <button
          type="submit"
          disabled={sending}
          className="t-micro group inline-flex items-center gap-3 bg-blue px-6 py-4 text-white transition-colors duration-300 hover:bg-white hover:text-black disabled:cursor-wait disabled:opacity-60"
        >
          {sending ? "Sending" : "Send"}
          <span
            aria-hidden
            className="inline-block h-px w-8 bg-current transition-all duration-500 group-hover:w-12"
          />
        </button>

        {/* Announced to screen readers the moment it changes, without moving
            focus away from where the visitor already is. */}
        <p
          role="status"
          aria-live="polite"
          className={`t-small ${status === "error" ? "text-white" : "dim"}`}
        >
          {status === "sent" && site.contact.form.success}
          {status === "error" && site.contact.form.failure}
        </p>
      </div>
    </form>
  );
}
