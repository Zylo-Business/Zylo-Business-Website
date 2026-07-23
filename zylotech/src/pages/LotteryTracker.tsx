import { useEffect, useMemo, useState } from "react";
import { Download, Trash2, Plus, AlertCircle } from "lucide-react";
import SEOMeta from "../components/SEOMeta";
import SectionHeader from "../components/SectionHeader";

/**
 * Lottery Spending Tracker
 * ------------------------------------------------------------------
 * Port of the original "lottery-spend-tracker.xlsx" provided by Tony.
 * The math is unchanged from the spreadsheet — see docs/lottery-tracker.md
 * for the full formula breakdown.
 *
 * Persistence: localStorage. No backend, no remote sync (local-only).
 * Works in any browser, including offline.
 */

type Entry = {
  id: string;
  date: string;   // YYYY-MM-DD
  staked: number; // GHS
  won: number;    // GHS
};

const STORAGE_KEY = "zylotech.lottery-spend-tracker.v1";

const today = () => new Date().toISOString().slice(0, 10);

const fmt = (n: number) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 2 })
    .format(Number.isFinite(n) ? n : 0);

export default function LotteryTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ date: today(), staked: "", won: "" });
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      /* ignore corrupted storage */
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* quota or private mode — silently ignore */
    }
  }, [entries]);

  /* --- Spreadsheet math ported 1:1 -------------------------------- */
  // Sort chronologically for the running-net calculation
  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries]
  );

  // Per-row net + running net (mirrors columns E and F in the .xlsx)
  const enriched = useMemo(() => {
    let running = 0;
    return sorted.map((e) => {
      const netThisPlay = e.won - e.staked;
      running += netThisPlay;
      return { ...e, netThisPlay, runningNet: running };
    });
  }, [sorted]);

  // Totals (mirrors B4, B5, B6 in the .xlsx)
  const totalStaked = useMemo(() => sorted.reduce((s, e) => s + e.staked, 0), [sorted]);
  const totalWon    = useMemo(() => sorted.reduce((s, e) => s + e.won, 0), [sorted]);
  const net         = totalWon - totalStaked;

  /* --- Actions ---------------------------------------------------- */
  function addEntry(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const staked = parseFloat(form.staked);
    const won = parseFloat(form.won);

    if (!form.date) return setError("Pick a date.");
    if (!Number.isFinite(staked) || staked < 0) return setError("Staked must be 0 or more.");
    if (!Number.isFinite(won) || won < 0)       return setError("Won must be 0 or more.");

    const entry: Entry = {
      id: crypto.randomUUID(),
      date: form.date,
      staked,
      won,
    };
    setEntries((prev) => [...prev, entry]);
    setForm({ date: today(), staked: "", won: "" });
  }

  function deleteEntry(id: string) {
    if (!confirm("Delete this entry?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function exportCsv() {
    const rows = [
      ["Date", "Staked (GHS)", "Won (GHS)", "Net this play", "Running net"],
      ...enriched.map((e) => [
        e.date,
        e.staked.toFixed(2),
        e.won.toFixed(2),
        e.netThisPlay.toFixed(2),
        e.runningNet.toFixed(2),
      ]),
      [],
      ["Total stakes", totalStaked.toFixed(2)],
      ["Total winnings", totalWon.toFixed(2)],
      ["NET", net.toFixed(2)],
    ];
    const csv = rows
      .map((r) => r.map((c) => (/[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lottery-tracker-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (!confirm(`Wipe all ${entries.length} entries? This can't be undone.`)) return;
    setEntries([]);
  }

  const netColor = net > 0 ? "text-emerald-600" : net < 0 ? "text-rose-600" : "text-gray-500";

  return (
    <>
      <SEOMeta
        title="Lottery Tracker Ghana"
        description="Free tool to log every NLA play and see your real net — the totals that matter, not the wins you remember. Built for Ghanaian players."
        keywords="lottery tracker, NLA spending tracker, Ghana lottery, lottery budget tool"
        canonical="/lottery-tracker"
      />

      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-br from-navy to-teal-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
            Lottery Spending Tracker
          </h1>
          <p className="text-teal font-semibold mb-3">
            Log every play. The numbers that matter are the totals — not the wins you remember.
          </p>
          <p className="text-white/70 text-sm max-w-2xl mx-auto">
            Everything stays in your browser. Nothing is uploaded, nothing is shared.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Total money in (stakes)" value={fmt(totalStaked)} valueClass="text-navy" />
          <SummaryCard label="Total money out (winnings)" value={fmt(totalWon)} valueClass="text-navy" />
          <SummaryCard label="NET (out minus in)" value={fmt(net)} valueClass={netColor} highlight />
        </div>
      </section>

      {/* Add entry */}
      <section className="py-8 px-4 bg-[#F4F3EF]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Log a play" centered={false} />
          <form onSubmit={addEntry} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-card border border-gray-300 focus:border-teal focus:outline-none"
                max={today()}
              />
            </Field>
            <Field label="Staked (GHS)">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="e.g. 20"
                value={form.staked}
                onChange={(e) => setForm((f) => ({ ...f, staked: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-card border border-gray-300 focus:border-teal focus:outline-none"
              />
            </Field>
            <Field label="Won (GHS)">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="0 if didn't win"
                value={form.won}
                onChange={(e) => setForm((f) => ({ ...f, won: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-card border border-gray-300 focus:border-teal focus:outline-none"
              />
            </Field>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-teal text-white font-semibold px-5 py-2.5 rounded-full hover:bg-teal-dark transition-colors h-[44px]"
            >
              <Plus size={16} /> Add
            </button>
          </form>
          {error && (
            <p className="mt-3 text-rose-600 text-sm flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </p>
          )}
        </div>
      </section>

      {/* Entries table */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <SectionHeader title="Your plays" centered={false} />
            <div className="flex gap-2">
              <button
                onClick={exportCsv}
                disabled={!enriched.length}
                className="inline-flex items-center gap-2 border border-teal text-teal font-semibold px-4 py-2 rounded-full hover:bg-teal hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} /> Export CSV
              </button>
              <button
                onClick={clearAll}
                disabled={!enriched.length}
                className="inline-flex items-center gap-2 border border-rose-400 text-rose-500 font-semibold px-4 py-2 rounded-full hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} /> Clear all
              </button>
            </div>
          </div>

          {enriched.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-card p-12 text-center text-gray-500">
              No plays logged yet. Add your first one above to see the math kick in.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-card border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-[#F4F3EF] text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">Staked</th>
                    <th className="text-right px-4 py-3">Won</th>
                    <th className="text-right px-4 py-3">Net this play</th>
                    <th className="text-right px-4 py-3">Running net</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...enriched].reverse().map((e) => (
                    <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-navy font-medium">{e.date}</td>
                      <td className="px-4 py-3 text-right">{fmt(e.staked)}</td>
                      <td className="px-4 py-3 text-right">{fmt(e.won)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${e.netThisPlay > 0 ? "text-emerald-600" : e.netThisPlay < 0 ? "text-rose-600" : "text-gray-500"}`}>
                        {fmt(e.netThisPlay)}
                      </td>
                      <td className={`px-4 py-3 text-right font-semibold ${e.runningNet > 0 ? "text-emerald-600" : e.runningNet < 0 ? "text-rose-600" : "text-gray-500"}`}>
                        {fmt(e.runningNet)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteEntry(e.id)}
                          aria-label="Delete entry"
                          className="text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/80 leading-relaxed">
            Lottery is random. This tool doesn't predict, forecast, or guarantee anything —
            it just tells you the honest math of what you've already played. The win you remember
            doesn't matter as much as the net you've actually earned (or lost).
          </p>
          <p className="text-teal text-sm mt-4 font-semibold">Play within your means.</p>
        </div>
      </section>
    </>
  );
}

/* ---------- Small UI helpers --------------------------------------- */

function SummaryCard({
  label,
  value,
  valueClass,
  highlight,
}: {
  label: string;
  value: string;
  valueClass: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-card p-6 border ${
        highlight ? "bg-[#F4F3EF] border-gold" : "bg-[#F4F3EF] border-transparent"
      }`}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">{label}</p>
      <p className={`font-heading text-2xl md:text-3xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">{label}</span>
      {children}
    </label>
  );
}
