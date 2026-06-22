import confetti from "canvas-confetti";

/** Burst confetti when a user earns a reward. */
export function celebrateReward() {
  if (typeof window === "undefined") return;

  const duration = 2200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#2563eb", "#3b82f6", "#fbbf24", "#22c55e", "#ffffff"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#2563eb", "#3b82f6", "#fbbf24", "#22c55e", "#ffffff"],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#2563eb", "#3b82f6", "#fbbf24", "#22c55e", "#ffffff"],
  });

  frame();
}
