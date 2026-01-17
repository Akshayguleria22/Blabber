function Logo({ size = "md" }) {
  const sizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${sizes[size] || sizes.md}`}>
      <span className="size-8 rounded-xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),rgba(255,255,255,0))] bg-[rgb(var(--accent))] shadow-sm flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path
            d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H9l-3.5 3v-3.5A2.5 2.5 0 0 1 3 12.5v-6A2.5 2.5 0 0 1 5.5 4H6"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </span>
      <span className="font-semibold tracking-tight">Blabber</span>
    </div>
  );
}

export default Logo;
