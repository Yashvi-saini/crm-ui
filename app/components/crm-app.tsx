"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { SEED_LEADS, STATUSES, TEAM, type Lead, type Status } from "../lib/leads";
import { AddLeadDialog } from "./add-lead-dialog";
import { FollowUpBars, SourceBars, StatusDonut } from "./charts";
import { STATUS_STYLE, addDays, formatDate } from "./status";

type SortKey = "id" | "company" | "status" | "followUp";
type DueFilter = "all" | "overdue" | "week" | "none";

const isActive = (l: Lead) => l.status !== "Won" && l.status !== "Lost";
const overdueAt = (l: Lead, today: string) => !!today && !!l.followUp && isActive(l) && l.followUp < today;
const inWeekAt = (l: Lead, today: string) =>
  !!today && !!l.followUp && l.followUp >= today && l.followUp <= addDays(today, 6);

const control = "rounded-md border border-line bg-surface px-3 py-2 text-sm";

function useToday(): string {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    },
    () => "",
  );
}

function Kpi({ label, value, note }: { label: string; value: number | string; note: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{note}</p>
    </div>
  );
}

export function CrmApp() {
  const today = useToday();
  const [leads, setLeads] = useState<Lead[]>(SEED_LEADS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [assignee, setAssignee] = useState("All");
  const [due, setDue] = useState<DueFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "id", dir: 1 });
  const [adding, setAdding] = useState(false);

  const isOverdue = (l: Lead) => overdueAt(l, today);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = leads.filter((l) => {
      if (status !== "All" && l.status !== status) return false;
      if (assignee === "Unassigned" ? l.assignee !== "" : assignee !== "All" && l.assignee !== assignee) return false;
      if (due === "overdue" && !overdueAt(l, today)) return false;
      if (due === "week" && !inWeekAt(l, today)) return false;
      if (due === "none" && l.followUp) return false;
      if (!q) return true;
      return [l.id, l.company, l.contact, l.email, l.phone, l.notes].some((v) => v.toLowerCase().includes(q));
    });
    const { key, dir } = sort;
    return rows.sort((a, b) => {
      if (key === "followUp" && (!a.followUp || !b.followUp)) return a.followUp ? -1 : b.followUp ? 1 : 0;
      return a[key].localeCompare(b[key]) * dir;
    });
  }, [leads, query, status, assignee, due, sort, today]);

  const update = (id: string, patch: Partial<Lead>) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  const dueSoon = leads.filter((l) => isActive(l) && (overdueAt(l, today) || inWeekAt(l, today))).length;
  const overdue = leads.filter(isOverdue).length;
  const filtersOn = query !== "" || status !== "All" || assignee !== "All" || due !== "all";

  const th = (label: string, key?: SortKey) => (
    <th
      scope="col"
      aria-sort={key && sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
      className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-white"
    >
      {key ? (
        <button type="button" onClick={() => toggleSort(key)} className="uppercase tracking-wide hover:underline">
          {label}
          {sort.key === key && <span aria-hidden> {sort.dir === 1 ? "↑" : "↓"}</span>}
        </button>
      ) : (
        label
      )}
    </th>
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lead Management</h1>
          <p className="text-sm text-muted">Track leads, assignments, and follow-ups in one place.</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Add lead
        </button>
      </header>

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Total leads" value={leads.length} note="All time" />
        <Kpi label="Open leads" value={leads.filter(isActive).length} note="New, contacted, proposal sent" />
        <Kpi label="Follow-ups due" value={today ? dueSoon : "-"} note={today ? `${overdue} overdue, next 7 days` : "Next 7 days"} />
        <Kpi label="Won clients" value={leads.filter((l) => l.status === "Won").length} note="All time" />
      </section>

      <section aria-label="Charts" className="mt-4 grid gap-4 lg:grid-cols-3">
        <StatusDonut leads={leads} />
        <FollowUpBars leads={leads} today={today} />
        <SourceBars leads={leads} />
      </section>

      <section aria-label="Leads" className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, email, phone, or notes"
            aria-label="Search leads"
            className={`${control} w-full sm:w-80`}
          />
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} aria-label="Filter by assignee" className={control}>
            <option value="All">All assignees</option>
            <option value="Unassigned">Unassigned</option>
            {TEAM.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={due} onChange={(e) => setDue(e.target.value as DueFilter)} aria-label="Filter by follow-up" className={control}>
            <option value="all">Any follow-up date</option>
            <option value="overdue">Overdue</option>
            <option value="week">Due in next 7 days</option>
            <option value="none">No follow-up set</option>
          </select>
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {(["All", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  status === s ? "border-brand bg-brand text-white" : "border-line bg-surface text-muted hover:bg-background"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm text-muted">
            <span aria-live="polite">
              {visible.length} of {leads.length} leads
            </span>
            {filtersOn && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatus("All");
                  setAssignee("All");
                  setDue("all");
                }}
                className="text-brand underline-offset-2 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead className="bg-brand">
              <tr>
                {th("Lead ID", "id")}
                {th("Company / Contact", "company")}
                {th("Email")}
                {th("Phone")}
                {th("Source")}
                {th("Status", "status")}
                {th("Assigned to")}
                {th("Next follow-up", "followUp")}
                {th("Last contact")}
                {th("Notes")}
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} className="border-b border-line last:border-0 hover:bg-[#f8faf9]">
                  <td className="whitespace-nowrap px-3 py-2.5 font-medium text-muted">{l.id}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{l.company}</div>
                    <div className="text-xs text-muted">{l.contact}</div>
                  </td>
                  <td className="px-3 py-2.5 text-muted">{l.email}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{l.phone}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">{l.source}</td>
                  <td className="px-3 py-2.5">
                    <select
                      value={l.status}
                      onChange={(e) => update(l.id, { status: e.target.value as Status })}
                      aria-label={`Status for ${l.company}`}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[l.status].pill}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2.5">
                    <select
                      value={l.assignee}
                      onChange={(e) => update(l.id, { assignee: e.target.value })}
                      aria-label={`Assignee for ${l.company}`}
                      className="rounded-md border border-line bg-surface px-2 py-1 text-sm"
                    >
                      <option value="">Unassigned</option>
                      {TEAM.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <input
                      type="date"
                      value={l.followUp}
                      onChange={(e) => update(l.id, { followUp: e.target.value })}
                      aria-label={`Follow-up date for ${l.company}`}
                      className="rounded-md border border-line bg-surface px-2 py-1 text-sm"
                    />
                    {isOverdue(l) && <span className="ml-2 text-xs font-medium text-red-700">Overdue</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-muted">{formatDate(l.lastContact)}</td>
                  <td className="px-3 py-2.5 text-muted">{l.notes || "-"}</td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-12 text-center text-muted">
                    No leads match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <AddLeadDialog
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={(data) => {
          setLeads((prev) => {
            const next = Math.max(0, ...prev.map((l) => Number(l.id.replace("LEAD-", "")))) + 1;
            return [...prev, { ...data, id: `LEAD-${String(next).padStart(3, "0")}`, lastContact: today }];
          });
          setAdding(false);
        }}
      />
    </div>
  );
}
