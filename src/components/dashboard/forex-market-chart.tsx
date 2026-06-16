"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  label: string;
};

const PAIRS = [
  { id: "EUR/USD", base: 1.0852 },
  { id: "GBP/USD", base: 1.2641 },
  { id: "USD/ETB", base: 57.42 },
  { id: "XAU/USD", base: 2348.5 },
];

function nextCandle(prev: Candle, base: number): Candle {
  const drift = (Math.random() - 0.48) * base * 0.002;
  const open = prev.close;
  const close = Math.max(base * 0.95, open + drift);
  const high = Math.max(open, close) + Math.random() * base * 0.001;
  const low = Math.min(open, close) - Math.random() * base * 0.001;
  const now = new Date();
  return {
    open,
    high,
    low,
    close,
    label: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
  };
}

function seedCandles(base: number, count: number): Candle[] {
  const candles: Candle[] = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    const c = nextCandle(
      { open: price, high: price, low: price, close: price, label: `${i}` },
      base
    );
    candles.push({ ...c, label: `${9 + Math.floor(i / 4)}:${(i % 4) * 15 || "00"}` });
    price = c.close;
  }
  return candles;
}

export function ForexMarketChart() {
  const [pairId, setPairId] = useState(PAIRS[0].id);
  const pair = PAIRS.find((p) => p.id === pairId) ?? PAIRS[0];
  const [candles, setCandles] = useState<Candle[]>(() => seedCandles(pair.base, 20));

  useEffect(() => {
    setCandles(seedCandles(pair.base, 20));
  }, [pair.base]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        const updated = nextCandle(last, pair.base);
        return [...prev.slice(1), updated];
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [pair.base]);

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const change = last.close - prev.close;
  const changePct = (change / prev.close) * 100;
  const isUp = change >= 0;

  const { min, max } = useMemo(() => {
    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const pad = (max - min) * 0.1 || 0.01;
    return { min: min - pad, max: max + pad };
  }, [candles]);

  const chartH = 160;
  const chartW = 100;

  function y(price: number) {
    return chartH - ((price - min) / (max - min)) * chartH;
  }

  return (
    <Card className="overflow-hidden">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Live Forex Market
          </p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-display text-2xl font-bold">{last.close.toFixed(4)}</p>
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-semibold",
                isUp ? "text-green-500" : "text-red-500"
              )}
            >
              {isUp ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {isUp ? "+" : ""}
              {changePct.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PAIRS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPairId(p.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                pairId === p.id
                  ? "bg-primary/15 text-primary"
                  : "text-muted hover:bg-surface-bright"
              )}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border bg-surface-bright/50">
        <svg
          viewBox={`0 0 ${candles.length * (chartW / candles.length)} ${chartH}`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {candles.map((c, i) => {
            const x = i * (chartW / candles.length) + (chartW / candles.length) * 0.2;
            const w = (chartW / candles.length) * 0.5;
            const up = c.close >= c.open;
            const color = up ? "var(--chart-up)" : "var(--chart-down)";
            const bodyTop = y(Math.max(c.open, c.close));
            const bodyBot = y(Math.min(c.open, c.close));
            const bodyH = Math.max(bodyBot - bodyTop, 1);
            return (
              <g key={i}>
                <line
                  x1={x + w / 2}
                  x2={x + w / 2}
                  y1={y(c.high)}
                  y2={y(c.low)}
                  stroke={color}
                  strokeWidth="1"
                />
                <rect
                  x={x}
                  y={bodyTop}
                  width={w}
                  height={bodyH}
                  fill={color}
                  rx="0.5"
                />
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-2 left-3 flex gap-4 text-[10px] text-muted">
          <span>O {last.open.toFixed(4)}</span>
          <span>H {last.high.toFixed(4)}</span>
          <span>L {last.low.toFixed(4)}</span>
          <span>C {last.close.toFixed(4)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Simulated market data for display — updated every few seconds.
      </p>
    </Card>
  );
}
