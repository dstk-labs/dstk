import { Logo } from "@/components/logo/Logo";

type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = 32 }: BrandMarkProps) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "var(--color-alpha-medium)",
        borderRadius: size >= 40 ? "var(--radius-lg)" : "var(--radius-md)",
        display: "inline-flex",
        flexShrink: 0,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <Logo h={size * 0.6} w={size * 0.6} />
    </div>
  );
}
