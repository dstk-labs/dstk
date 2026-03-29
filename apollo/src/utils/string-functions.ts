export function shishKebab(str: string) {
  return str
    .replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
