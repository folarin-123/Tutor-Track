const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatNaira(kobo) {
  const naira = (Number(kobo) || 0) / 100;
  return nairaFormatter.format(naira);
}

const dateStyle = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(dateInput) {
  if (!dateInput) return "";
  let d;
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split("-").map(Number);
    d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  } else {
    d = new Date(dateInput);
  }
  if (Number.isNaN(d.getTime())) return String(dateInput);
  return dateStyle.format(d);
}
