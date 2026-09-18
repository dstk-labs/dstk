import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatFileSize(bytes: number) {
  if (bytes === 0)
    return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(value: null | string | undefined) {
  if (!value)
    return "—";
  return dayjs(value).format("MMM D, YYYY");
}

export function formatRelative(value: null | string | undefined) {
  if (!value)
    return "—";
  return dayjs(value).fromNow();
}

export function truncate(value: null | string | undefined, max = 60) {
  if (!value)
    return "—";
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
