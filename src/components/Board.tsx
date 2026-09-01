"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { COINS, type Status } from "@/lib/coins";
import { CoinCard } from "./CoinCard";
import { Input } from "./ui/Field";

type Filter = "new" | "unclaimed" | "graduated" | "all";

const FILTERS: { key: Filter; label: string; match?: Status }[] = [
  { key: "new", label: "New" },
  { key: "unclaimed", label: "Unclaimed", match: "unclaimed" },
  { key: "graduated", label: "Graduated", match: "graduated" },
  { key: "all", label: "All" },
];

export function Board() {
  const [filter, setFilter] = useState<Filter>("new");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      new: COINS.length,
      unclaimed: COINS.filter((c) => c.status === "unclaimed").length,
      graduated: COINS.filter((c) => c.status === "graduated").length,
      all: COINS.length,
    }),
    [],
  );

  const rows = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter);
    let list = active?.match ? COINS.filter((c) => c.status === active.match) : [...COINS];

    if (filter === "new") list.sort((a, b) => a.openedMinutesAgo - b.openedMinutesAgo);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((c) =>
        [c.ticker, c.name, c.handle, c.address].some((field) => field.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [filter, query]);

  return (
    <section id="board" className="mx-auto max-w-6xl px-5 sm:px-8 mt-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <h2 className="display text-4xl sm:text-5xl">The board</h2>
        <Link
          href="/start"
          className="eyebrow hover:text-accent transition-colors pb-1.5"
        >
          open one →
        </Link>
      </div>

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
        <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "eyebrow px-3.5 py-2 rounded-lg border-2 whitespace-nowrap transition-colors",
                filter === f.key
                  ? "border-accent text-accent"
                  : "border-line hover:border-line-strong hover:text-fg-soft",
              )}
            >
              {f.label}
              <span className="ml-2 opacity-60">{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <div className="lg:w-80">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ticker, name, @handle or contract"
            aria-label="Search the board"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-sm text-fg-muted">
          Nothing on the board matches that. It might still be unopened —{" "}
          <Link href="/start" className="text-accent hover:underline">
            open it yourself
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {rows.map((coin) => (
            <CoinCard key={coin.address} coin={coin} />
          ))}
        </div>
      )}
    </section>
  );
}
