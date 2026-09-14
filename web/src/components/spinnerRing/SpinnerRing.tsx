import type { ReactNode } from "react";

type SpinnerRingProps = {
  icon?: ReactNode;
  size?: number;
};

export function SpinnerRing({ icon, size = 56 }: SpinnerRingProps) {
  return (
    <div style={{ height: size, position: "relative", width: size }}>
      <div
        style={{
          animation: "sky-spin 0.9s linear infinite",
          border: "2px solid var(--color-border-default)",
          borderRadius: "var(--radius-full)",
          borderTopColor: "var(--sky-400)",
          inset: 0,
          position: "absolute",
        }}
      />
      {icon && (
        <div
          style={{
            alignItems: "center",
            display: "flex",
            inset: 0,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

export function AnimatedDots() {
  return (
    <span aria-hidden>
      {[0, 0.2, 0.4].map(delay => (
        <span
          key={delay}
          style={{
            animation: "sky-blink 1.4s infinite both",
            animationDelay: `${delay}s`,
          }}
        >
          .
        </span>
      ))}
    </span>
  );
}
