import { STATUSES, type Lead } from "../lib/leads";
import { STATUS_STYLE, addDays, weekday } from "./status";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-surface p-4">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{title}</h3>
      {children}
    </section>
  );
}

export function StatusDonut({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const r = 40;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <Panel title="Leads by status">
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label="Leads by status">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#eef1ef" strokeWidth="16" />
          {total > 0 &&
            STATUSES.map((s) => {
              const n = leads.filter((l) => l.status === s).length;
              if (!n) return null;
              const len = (n / total) * c;
              const el = (
                <circle
                  key={s}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={STATUS_STYLE[s].color}
                  strokeWidth="16"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
        </svg>
        <ul className="flex-1 space-y-1.5 text-sm">
          {STATUSES.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: STATUS_STYLE[s].color }} />
              <span className="text-muted">{s}</span>
              <span className="ml-auto pl-4 font-medium tabular-nums">{leads.filter((l) => l.status === s).length}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

export function FollowUpBars({ leads, today }: { leads: Lead[]; today: string }) {
  const days = today ? Array.from({ length: 7 }, (_, i) => addDays(today, i)) : [];
  const counts = days.map((d) => leads.filter((l) => l.followUp === d).length);
  const max = Math.max(1, ...counts);
  return (
    <Panel title="Follow-ups due (next 7 days)">
      <div className="flex h-28 items-end gap-3 border-b border-line">
        {days.map((d, i) => (
          <div key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs tabular-nums text-muted">{counts[i]}</span>
            <div
              className="w-full rounded-t-sm bg-brand/70"
              style={{ height: `${(counts[i] / max) * 75}%`, minHeight: counts[i] ? 4 : 1 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-3">
        {days.map((d) => (
          <span key={d} className="flex-1 text-center text-xs text-muted">
            {weekday(d)}
          </span>
        ))}
      </div>
    </Panel>
  );
}

export function SourceBars({ leads }: { leads: Lead[] }) {
  const counts = new Map<string, number>();
  leads.forEach((l) => counts.set(l.source, (counts.get(l.source) ?? 0) + 1));
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <Panel title="Leads by source">
      <ul className="space-y-2.5">
        {rows.map(([name, n]) => (
          <li key={name} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 text-muted">{name}</span>
            <div className="h-2.5 flex-1 rounded-sm bg-[#eef1ef]">
              <div className="h-full rounded-sm bg-brand/70" style={{ width: `${(n / max) * 100}%` }} />
            </div>
            <span className="w-5 text-right font-medium tabular-nums">{n}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
