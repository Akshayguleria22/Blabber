function Badge({ className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--accent),0.12)] px-3 py-1 text-xs font-medium text-[rgb(var(--accent))] ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
