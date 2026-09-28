export default function UnreadBadge({ count }) {
  const value = Number(count) || 0;
  if (value <= 0) return null;
  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}
