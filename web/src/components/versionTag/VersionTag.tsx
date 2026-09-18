type VersionTagProps = {
  version: number | string;
};

export function VersionTag({ version }: VersionTagProps) {
  return (
    <span
      style={{
        color: "var(--sky-200)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--font-size-3xs)",
        fontWeight: "var(--font-regular)",
      }}
    >
      v
      {version}
    </span>
  );
}
