# Lottery Spending Tracker — Formula Documentation

Page: `/lottery-tracker`
Component: `src/pages/LotteryTracker.tsx`
Original source: `lottery-spend-tracker.xlsx` (Tony's spreadsheet, ported 2026-06-18)
Storage: browser `localStorage` key `zylotech.lottery-spend-tracker.v1` — no server, no remote sync.

> "Log every play. The numbers that matter are the totals, not the wins you remember."

---

## The math (1:1 port from the spreadsheet)

The tracker stores one **entry** per play with three user inputs:

| Field | Type | Notes |
|---|---|---|
| `date` | `YYYY-MM-DD` | When the play was made |
| `staked` | `number` (GHS) | What you spent on that play |
| `won` | `number` (GHS) | What you won back (0 if nothing) |

From those three, the tracker derives the rest.

### Per-row computed columns

#### Net this play  *(spreadsheet column E)*

**Excel formula (E10 onwards):**

```excel
=IF(AND(C10="",D10=""), "", D10 - C10)
```

**Plain English:** if neither staked nor won is filled, show blank. Otherwise: `won − staked`.

**TypeScript equivalent:**

```ts
const netThisPlay = entry.won - entry.staked;
```

A positive value means that single play was profitable; negative means it cost more than it returned.

#### Running net  *(spreadsheet column F)*

**Excel formula (F10):**

```excel
=IF(E10="", "", E10)
```

**Excel formula (F11 onwards):**

```excel
=IF(E11="", "", IF(F10="", E11, F10 + E11))
```

**Plain English:** running total of net-this-play, in chronological order. Starts at the first entry's net and accumulates.

**TypeScript equivalent:**

```ts
let running = 0;
const enriched = sortedEntries.map((e) => {
  const netThisPlay = e.won - e.staked;
  running += netThisPlay;
  return { ...e, netThisPlay, runningNet: running };
});
```

> ⚠️ The `runningNet` must be calculated in **chronological order** (oldest → newest), regardless of how the table is sorted for display. The React component sorts a copy before computing, then displays newest-first in the UI.

### Top-of-page totals

#### Total money in (stakes)  *(spreadsheet cell B4)*

**Excel formula:**

```excel
=SUM(C10:C1000)
```

**TypeScript:**

```ts
const totalStaked = entries.reduce((sum, e) => sum + e.staked, 0);
```

#### Total money out (winnings)  *(spreadsheet cell B5)*

**Excel formula:**

```excel
=SUM(D10:D1000)
```

**TypeScript:**

```ts
const totalWon = entries.reduce((sum, e) => sum + e.won, 0);
```

#### NET (out minus in)  *(spreadsheet cell B6)*

**Excel formula:**

```excel
=B5 - B4
```

**TypeScript:**

```ts
const net = totalWon - totalStaked;
```

This is the **headline number** of the whole tool. A negative value (rendered in rose) is the honest answer most players don't want to face. A positive value (rendered in emerald) is rare in real lottery play and tells the truth too.

---

## UI behaviour

- **Newest entries on top** of the table for scannability, but math respects chronological order.
- **Delete with confirmation** — one click is too dangerous.
- **CSV export** includes per-row values + totals at the bottom, ready for Excel/Google Sheets.
- **Clear all** wipes localStorage with confirmation.
- **Validation:** date required, staked + won must be ≥ 0.
- **Date input max** is today — can't log a play that hasn't happened yet.
- **Currency:** all amounts formatted as GHS using `Intl.NumberFormat('en-GH')`.

## Privacy + storage

- **All data is local to the browser.** Nothing is sent over the network.
- **Key:** `zylotech.lottery-spend-tracker.v1` in `localStorage`.
- **Clearing browser data** wipes the tracker.
- **No analytics on user inputs.** (Page-level analytics still go through normal site instrumentation, but the entries themselves never leave the device.)

## Visual / brand notes

- Brand tokens used: `bg-teal`, `bg-navy`, `bg-gold`, `text-teal`, `bg-teal-dark`, `bg-[#F4F3EF]`, `rounded-card`, `font-heading`.
- Net color logic: positive → emerald, negative → rose, zero → muted grey.
- Hero gradient: `from-navy to-teal-dark`.
- Disclaimer band at the bottom is **non-negotiable** — it's the integrity layer that keeps Zylo Tech's lottery content separate from prediction-scam sites.

## Extraction notes

Tony noted this tracker is destined to be extracted into a separate product (likely a Selar PDF + companion web tool, or a standalone Telegram mini-app) later. The component is intentionally self-contained:

- Only depends on `react`, `react-router-dom`, `lucide-react`, and the brand's two shared components (`SEOMeta`, `SectionHeader`).
- All state is local; localStorage is the only persistence.
- All Tailwind classes use the project's existing tokens, so it ports cleanly to any other Zylo-branded surface.

To extract: copy `src/pages/LotteryTracker.tsx` and this doc; preserve the brand tokens or substitute equivalents.
