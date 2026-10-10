"use client";

import { useRef, type FormEvent } from "react";
import { SOURCES, STATUSES, TEAM, type Lead } from "../lib/leads";

const field =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm placeholder:text-[#9aa5a0]";

export function AddLeadDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (l: Omit<Lead, "id">) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  if (!open) return null;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "").trim();
    onAdd({
      company: g("company"),
      contact: g("contact"),
      email: g("email"),
      phone: g("phone"),
      source: g("source") as Lead["source"],
      status: g("status") as Lead["status"],
      assignee: g("assignee"),
      followUp: g("followUp"),
      lastContact: "",
      notes: g("notes"),
    });
    formRef.current?.reset();
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        ref={formRef}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label="Add lead"
        className="w-full max-w-lg rounded-lg border border-line bg-surface p-6 shadow-lg"
      >
        <h2 className="text-lg font-semibold">Add lead</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="col-span-2 text-sm">
            <span className="mb-1 block text-muted">Company</span>
            <input name="company" required autoFocus className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Contact person</span>
            <input name="contact" required className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Phone</span>
            <input name="phone" className={field} />
          </label>
          <label className="col-span-2 text-sm">
            <span className="mb-1 block text-muted">Email</span>
            <input name="email" type="email" required className={field} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Source</span>
            <select name="source" className={field}>
              {SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Status</span>
            <select name="status" className={field}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Assigned to</span>
            <select name="assignee" className={field}>
              <option value="">Unassigned</option>
              {TEAM.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted">Next follow-up</span>
            <input name="followUp" type="date" className={field} />
          </label>
          <label className="col-span-2 text-sm">
            <span className="mb-1 block text-muted">Notes</span>
            <textarea name="notes" rows={2} className={field} />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-line px-4 py-2 text-sm hover:bg-background">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover">
            Save lead
          </button>
        </div>
      </form>
    </div>
  );
}
