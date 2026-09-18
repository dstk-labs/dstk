import { BrandMark } from "@/components/brandMark/BrandMark";
import { SpinnerRing } from "@/components/spinnerRing/SpinnerRing";

export function SplashScreen() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <SpinnerRing icon={<BrandMark size={28} />} />
      <div style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-2xs)" }}>
        Loading your workspace…
      </div>
    </div>
  );
}
